# Firebase Integration - Authentication System

## Overview
Vijayadurga Aquafoods now uses a hybrid authentication system combining:
- **Sign Up**: Email/Password registration with user profile data
- **Login**: Mobile OTP-based authentication
- **User Management**: Firebase configuration ready for future enhancements

## Firebase Configuration

### Credentials
```
Project ID: vijayadurga-aquafoods
API Key: AIzaSyBKNsrCoCs9QMNYjkI67sr2kVTlutUtto8
Auth Domain: vijayadurga-aquafoods.firebaseapp.com
```

The Firebase configuration is stored in: `assets/js/firebase-config.js`

## Authentication Flow

### 1. Sign Up Process
**File**: `signup.html`

- User enters: Full Name, Email, Phone Number, Password
- Form validates:
  - All fields required
  - Valid 10-digit phone number
  - Password minimum 6 characters
  - Passwords must match
  - Terms acceptance required

- User data is stored in browser's localStorage:
```javascript
{
  fullname: "User Name",
  email: "user@example.com",
  phone: "9876543210",
  password: "securepassword",
  createdAt: "2026-06-07T..."
}
```

### 2. Login Process
**File**: `login.html`

1. **Mobile Input**: User enters 10-digit mobile number
2. **Send OTP**: System generates 6-digit OTP
   - OTP is logged to console for testing
   - Timer starts (60 seconds)
3. **Verify OTP**: User enters OTP
   - System validates the OTP
   - On success: Creates user session
4. **Session Creation**:
```javascript
{
  mobile: "9876543210",
  email: "user@example.com",
  name: "User Name",
  loginTime: "2026-06-07T..."
}
```

### 3. User Account
**File**: `account.html`

- Accessible only to logged-in users
- Displays user profile information
- Shows order summary (placeholder)
- Quick actions: Shop, View Cart, Logout

## Storage Mechanism

### localStorage Keys Used:
- `isLoggedIn`: Boolean flag for login status
- `currentUser`: JSON object with user session data
- `userMobile`: User's mobile number
- `pendingSignup`: Temporary signup data
- `va-cart`: Shopping cart items
- `va-location`: Delivery location

## Navigation Updates

### Login Button Behavior:
- **Not Logged In**: Shows "Login" button linking to login.html
- **Logged In**: Shows user name as "👤 [Name]" linking to account.html

### Sign Up Button:
- Hidden when user is logged in

## Files Modified/Created

### New Files:
1. `assets/js/firebase-config.js` - Firebase configuration and exports
2. `account.html` - User account dashboard
3. `signup.html` - User registration page (updated)
4. `login.html` - OTP-based login page (updated)

### Updated Files:
1. `assets/js/script.js` - Authentication handlers
2. `assets/css/style.css` - Account page styling
3. All HTML pages - Navigation updated to link to account.html

## Current Testing

### Test OTP Login:
1. Go to `login.html`
2. Enter any 10-digit number
3. Click "Send OTP"
4. Check browser console for generated OTP
5. Enter OTP and verify

### Test Sign Up:
1. Go to `signup.html`
2. Fill all required fields
3. Click "Create Account"
4. Redirects to login.html
5. Use the mobile number to login

## Future Enhancements

The Firebase infrastructure is ready for:
- ✅ Real OTP SMS integration (Twilio, Firebase SMS)
- ✅ User database in Firestore
- ✅ Google OAuth authentication
- ✅ Password reset functionality
- ✅ User profile editing
- ✅ Order history tracking
- ✅ Address management

## Security Notes

**Current Implementation:**
- Uses browser localStorage for session management
- OTP is generated client-side (demo purpose)
- Password stored in localStorage temporarily

**Production Recommendations:**
1. Use Firebase Realtime Database or Firestore for user data
2. Implement server-side OTP generation and verification
3. Use HTTPS for all communications
4. Encrypt sensitive data
5. Implement token-based authentication
6. Add rate limiting for OTP requests

## Firebase Services Available

The configuration file exports:
- `auth` - Firebase Authentication instance
- `db` - Firestore Database instance
- `googleProvider` - Google OAuth provider
- Helper functions for user operations

All Firebase methods are imported and ready to use:
- `createUserWithEmailAndPassword()`
- `signInWithEmailAndPassword()`
- `signInWithPopup()`
- `signOut()`
- `updateProfile()`
- `onAuthStateChanged()`

## Support & Maintenance

For updates or issues with authentication:
1. Check browser console for error messages
2. Verify localStorage data: `localStorage.getItem('currentUser')`
3. Test OTP generation console logs
4. Clear browser cache if experiencing login issues

---

**Last Updated**: June 7, 2026
**Status**: Development/Testing Phase
