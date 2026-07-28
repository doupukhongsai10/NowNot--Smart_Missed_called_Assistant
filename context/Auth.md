---
name: Violet Void — Auth Spec (Log-In & Sign-Up)
colors:
  surface: '#12131a'
  bg-base: '#0B0D1A'
  primary: '#d2bbff'
  primary-container: '#7c3aed'
---

# Authentication Specification (Log-In & Sign-Up)

NowNot includes user authentication featuring **Log-In** and **Sign-Up** pages designed with Gradient Dark aesthetics and glassmorphism.

---

## 1. Flow & User Interface

### Log-In Screen
- **Brand Logo & Title**: `NowNot — Smart Missed Call Assistant`
- **Fields**:
  - **Phone Number**: Monospace phone input with default country code prefix (`+1`, `+91`, etc.).
  - **Password**: Password input field with show/hide password toggle button.
- **Action**: `Log In` primary button.
- **Switch Link**: *"Don't have an account? Sign Up"*

### Sign-Up Screen
- **Fields**:
  - **Full Name**: User's display name.
  - **Phone Number**: Primary mobile phone number (used as unique login credential).
  - **Password**: Account password (minimum 6 characters).
  - **Confirm Password**: Password confirmation.
- **Action**: `Create Account` primary button.
- **Switch Link**: *"Already have an account? Log In"*

---

## 2. Session Management & Cloud Sync

- **Session Store**: Authenticated session details stored in `nn_auth_session`.
- **Auto Login**: App automatically remembers logged-in state on launch.
- **Sign Out**: Available in the user profile menu to log out and return to Auth screen.
- **Cloud Integration**: Phone numbers and user profile collection records synced with Cloudinary cloud storage endpoints.
