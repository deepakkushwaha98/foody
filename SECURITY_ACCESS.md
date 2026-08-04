# Security & Access Document

## Product Name
Foody

## Purpose
This document explains how users authenticate, what each role is allowed to do, how data access is restricted, and how the app should respond when something goes wrong.

The current app is not using database-native row-level security. Access control is enforced in the application layer through cookies, JWTs, middleware, and role checks.

## Authentication Method
Foody currently supports these login and access paths:

- Email and password sign-up and sign-in.
- Google auth sign-in through Firebase on the frontend, then account creation or login on the backend.
- OTP-based password reset through email.
- HTTP-only cookie authentication using a JWT token.

### How login works
1. A user signs up or signs in.
2. The backend validates the credentials.
3. The backend creates a JWT for the user.
4. The JWT is stored in an HTTP-only cookie named `token`.
5. Future protected requests read that cookie to identify the user.

### Why this method fits the app
- It works well for a browser-based food delivery app.
- It keeps the token out of local storage.
- It supports both regular email/password users and Google-based users.
- It works cleanly with cookie-based session behavior and Socket.IO identity checks.

## User Roles and Permissions
### Guest
A guest is someone who has not signed in.

Can:
- View only public marketing or landing pages if those are exposed.
- Access sign-up, sign-in, and password reset screens.

Cannot:
- Place orders.
- Access carts, order history, or tracking.
- Create or edit shops and items.
- Access admin pages.

### User
This is the standard customer role.

Can:
- Browse shops and items.
- Search for food by city and keyword.
- Add items to cart and checkout.
- Place and track orders.
- View their own order history.
- Update their own delivery location.
- Rate delivered food items when that feature is available.

Cannot:
- Edit shops.
- Add menu items.
- View other users’ orders.
- Access owner or admin tools.
- Accept delivery assignments.

### Owner
This role belongs to a shop owner.

Can:
- Create or edit their own shop.
- Upload shop images.
- Add items to their shop menu.
- Edit their own items.
- View incoming orders for their shop.
- Receive real-time order updates.

Cannot:
- Edit shops they do not own.
- Edit items from other shops.
- Access customer-only checkout flows as an owner action.
- Access superadmin data across the entire platform.

### DeliveryBoy
This role belongs to a delivery partner.

Can:
- Receive delivery assignments.
- Accept an available delivery assignment.
- View the order assigned to them.
- Update delivery status for the assigned order.
- Send and verify delivery OTPs during handoff.
- Update their live location.

Cannot:
- Modify shop menus.
- View all orders in the system.
- Accept more than one active assignment if the business rule blocks it.
- Access superadmin reports.

### Superadmin
This is the highest privileged role in the current backend.

Can:
- View all users.
- View all shops.
- View all orders.
- View all delivery assignments.
- Perform platform-level oversight.

Cannot:
- Bypass middleware protections.
- Edit data without going through the API and validation rules.

## Access Control Rules
### Public data
These resources are intentionally accessible without a full authenticated session where the routes allow it:
- Shop listings by city.
- General shop listings where exposed for debugging or browsing.
- Sign-up and sign-in pages.

### Protected data
These resources require authentication:
- Current user profile.
- Cart data.
- Orders.
- Shop creation and editing.
- Menu item creation and editing.
- Delivery assignment actions.
- Location updates.

### Ownership rules
The app should enforce these rules in code:
- A user can only edit their own profile data.
- A shop owner can only edit shops they own.
- A shop owner can only edit items that belong to their shop.
- A customer can only read their own cart and order history.
- A delivery partner can only access the assignment currently given to them.
- A superadmin can read platform-wide operational data.

### Current implementation note
The backend uses middleware such as `isAuth` and `protect` to read the JWT cookie and identify the user. Admin-only routes use role checks before returning platform data.

## Row-Level Security Rules
MongoDB does not provide the same built-in row-level security model as systems like Supabase. In this app, row-level security must be enforced at the application layer.

### Rules by collection
#### User
- A user can read and update only their own record unless they are a superadmin.
- Delivery location and socket state should be updated only for the authenticated user.

#### Shop
- A shop owner can read and edit only shops they own.
- Customers can read shops that are public in the selected city.
- Superadmin can read all shops.

#### Item
- A shop owner can create and edit only items linked to their own shop.
- Customers can read items that belong to public shops.
- Superadmin can read all items.

#### Cart
- A user can only create, read, sync, or clear their own cart.
- No other user should be able to read another customer’s cart.

#### Order
- A user can only read their own orders.
- A shop owner can only read the shop orders tied to their shop.
- A delivery partner can only read assignments and order segments assigned to them.
- Superadmin can read all orders.

#### DeliveryAssignment
- A delivery partner can only accept assignments that are available to them.
- A delivery partner can only see their own active or accepted tasks.
- Superadmin can read all assignments.

## Error Handling Guide
### Authentication errors
#### Invalid sign-up input
- Trigger: missing name, email, mobile, password, or invalid role.
- Response: show a clear validation message.
- Current examples: `Invalid role provided`, `Password should be at least 6 characters.`, `Mobile must be at least 10 digits`.

#### Existing account
- Trigger: user tries to sign up with an email that already exists.
- Response: `User already exists`.

#### Wrong password
- Trigger: sign-in password does not match the stored hash.
- Response: `incorrect password`.

#### Missing or invalid token
- Trigger: protected route receives no token or a failed JWT check.
- Response: return `401` and send a message like `Authentication token not found`, `token not found`, or `Not authorized`.

#### Password reset OTP failure
- Trigger: user enters a wrong OTP, expired OTP, or tries to reset without verifying OTP.
- Response: `Invalid or expired OTP` or `otp not verified`.

### Authorization errors
#### Unauthorized shop access
- Trigger: a user tries to edit a shop they do not own.
- Response: `403 Access denied`.

#### Unauthorized admin access
- Trigger: non-superadmin tries to call admin routes.
- Response: `403 Access denied` or `Access denied. Admin only.`

#### Unauthorized order access
- Trigger: a user tries to read or update another user’s order.
- Response: `404` or `403` depending on whether the resource should be hidden or blocked.

### Input and validation errors
#### Empty checkout or missing address
- Trigger: user submits an order without a delivery address.
- Response: `send complete delivery address`.

#### Missing geolocation values
- Trigger: location update is sent without latitude or longitude.
- Response: `latitude or longitude is missing`.

#### Invalid rating request
- Trigger: user rates an item in a way the backend does not accept.
- Response: `Invalid rating request`.

#### Invalid delivery OTP
- Trigger: delivery OTP does not match.
- Response: `invalid otp`.

### System and service errors
#### Database failure
- Trigger: MongoDB connection or query failure.
- Response: show a generic server error and log the detailed exception server-side.

#### Email failure
- Trigger: Nodemailer or Gmail SMTP fails while sending OTPs.
- Response: show a retryable error such as `Unable to send verification email`.

#### Image upload failure
- Trigger: Cloudinary upload fails or file deletion fails.
- Response: show an upload failure message and keep the form open so the user can retry.

#### Socket disconnect
- Trigger: a user goes offline or loses network.
- Response: mark the socket as disconnected and allow reconnection without losing account state.

#### Payment failure
- Trigger: online payment fails or payment reference is invalid.
- Response: keep the order in a pending or failed state and let the user retry if supported.

## Edge Cases
### Authentication and account edge cases
- User signs in with an email that exists but has no password because the account was created through Google auth.
- User tries to reset a password after OTP expiry.
- User logs out while a socket connection is still active.
- User opens the app on multiple devices at the same time.

### Role edge cases
- A user account is incorrectly assigned more than one role.
- A delivery partner accepts one order and then tries to accept another before the first is completed.
- A shop owner attempts to edit another owner’s shop or menu item.
- A superadmin account is created incorrectly as a regular user.

### Cart and order edge cases
- User submits checkout with an empty cart.
- Cart contains items from a shop that is no longer active.
- Item price changes after the item was added to cart.
- User retries checkout after a failed payment.
- Order status changes while the customer is still viewing the previous state.

### Delivery edge cases
- Delivery partner is offline when an assignment is broadcast.
- Delivery partner’s location is stale or missing.
- Delivery OTP is entered after expiration.
- Delivery partner loses connection mid-delivery and reconnects later.

### UI and network edge cases
- User accesses a protected route directly from the browser.
- User refreshes the page in the middle of a checkout or order-tracking flow.
- Network is slow and data loading takes longer than expected.
- Socket updates arrive before the initial API data finishes loading.

### Recommended handling behavior
- Show a clear message instead of a blank screen.
- Preserve user input where possible.
- Keep order state stable and avoid double-submitting checkout.
- Reconnect sockets automatically when possible.
- Fail closed on protected data access.

## Security Notes
- Keep JWTs in HTTP-only cookies.
- Do not store secrets in frontend code.
- Do not rely on client-side role checks alone.
- Validate every write request on the backend.
- Log detailed errors server-side, but show simple messages to users.
- Treat row-level access as an API responsibility, not a frontend responsibility.

## Launch Checklist
- Verify all protected routes reject missing tokens.
- Verify role checks block owner and admin surfaces correctly.
- Verify users cannot access other users’ orders or carts.
- Verify shop owners cannot edit data outside their own shop.
- Verify delivery partners can only accept and view assignments intended for them.
- Verify OTP expiration is enforced.
- Verify email, image upload, and socket failure states are handled cleanly.
