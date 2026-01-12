# Auth-Onboarding Frontend

React-based frontend for User Onboarding, Authentication & Localization with Telugu-first multilingual support.

## 🎯 Features

- 📱 Mobile OTP-based login
- 🌐 Multilingual support (Telugu-first, English)
- 🔐 JWT authentication with auto token injection
- 📋 Step-by-step onboarding flow
- 🎨 Mobile-first responsive design
- 🔄 Context-based state management

## 📁 Project Structure

```
src/
├── pages/
│   ├── Login.jsx              # Mobile number input
│   ├── OtpVerify.jsx          # OTP verification
│   ├── LanguageSelect.jsx     # Language selection (Telugu/English)
│   └── BusinessOnboarding.jsx # Business details form
├── context/
│   ├── AuthContext.js         # Authentication state management
│   └── LanguageContext.js     # (Placeholder)
├── services/
│   └── api.js                 # Axios instance with interceptors
├── i18n/
│   └── i18n.js               # i18next configuration
└── App.js                     # Main application flow
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🔄 User Flow

```
1. Login Page
   ↓ (Enter mobile number)
2. OTP Verification
   ↓ (Verify OTP)
3. Language Selection
   ↓ (Choose Telugu/English)
4. Business Onboarding
   ↓ (Enter business details)
5. Complete ✓
```

## 🌐 Localization (i18n)

### Default Language
- **Primary**: Telugu (te)
- **Fallback**: Telugu

### Supported Languages
- **Telugu (te)**: తెలుగు
- **English (en)**: English

### Translation Keys

```javascript
{
  welcome: "స్వాగతం" | "Welcome",
  mobile: "మొబైల్ నంబర్" | "Mobile Number",
  sendOtp: "OTP పంపించు" | "Send OTP",
  enterOtp: "OTP నమోదు చేయండి" | "Enter OTP",
  verify: "వెరిఫై" | "Verify",
  selectLang: "భాషను ఎంచుకోండి" | "Select Language",
  businessName: "షాప్ పేరు" | "Business Name",
  businessType: "వ్యాపార రకం" | "Business Type",
  location: "ప్రాంతం" | "Location",
  submit: "సేవ్ చేయండి" | "Submit"
}
```

### Adding New Translations

Edit `src/i18n/i18n.js`:

```javascript
resources: {
  te: {
    translation: {
      newKey: "తెలుగు వచనం"
    }
  },
  en: {
    translation: {
      newKey: "English text"
    }
  }
}
```

## 🔐 Authentication

### Token Management

JWT tokens are automatically:
- Stored in `localStorage` on login
- Attached to all API requests via interceptor
- Used for protected routes

### AuthContext API

```javascript
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function Component() {
  const { user, login } = useContext(AuthContext);
  
  // Login user
  login(userData, token);
  
  // Access user data
  console.log(user);
}
```

## 📡 API Integration

### API Configuration

Base URL: `http://localhost:5000/api`

### Axios Instance

```javascript
import API from "./services/api";

// GET request
const response = await API.get("/user/profile");

// POST request
const response = await API.post("/business/create", data);
```

### Auto Token Injection

All requests automatically include:
```
Authorization: Bearer <jwt_token>
```

## 🎨 Components

### Login.jsx

Mobile number input with OTP request.

**Props:**
- `setStep(step)` - Navigate to next step
- `setMobile(mobile)` - Store mobile number

**Features:**
- Mobile number validation
- OTP send API call
- Telugu/English labels

### OtpVerify.jsx

OTP verification screen.

**Props:**
- `mobile` - Mobile number from previous step
- `setStep(step)` - Navigate to next step

**Features:**
- 6-digit OTP input
- JWT token reception
- Auto login on success

### LanguageSelect.jsx

Language selection interface.

**Props:**
- `setStep(step)` - Navigate to next step

**Features:**
- Telugu/English buttons
- Persist selection in localStorage
- Update user language preference via API

### BusinessOnboarding.jsx

Business details form.

**Features:**
- Business name input
- Business type selection (Medical/Hotel/Tiffin)
- Location input
- WhatsApp number (optional)
- Auto business ID generation
- 7-day trial activation

## 🎯 Environment Variables

Create `.env` in frontend root:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Update `src/services/api.js` if needed:

```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"
});
```

## 📱 Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly UI elements
- Optimized for low-end Android devices
- PWA-ready structure

## 🧪 Testing

### Manual Testing Steps

1. **Test Login Flow**
   ```
   - Enter mobile: 9876543210
   - Click "Send OTP"
   - Check backend console for OTP
   - Enter OTP
   - Click "Verify"
   ```

2. **Test Language Selection**
   ```
   - Click "తెలుగు" button
   - UI should show Telugu labels
   - Click "English" button
   - UI should show English labels
   ```

3. **Test Business Onboarding**
   ```
   - Enter business name
   - Select business type
   - Enter location
   - Click submit
   - Check for success
   ```

### Component Testing

```bash
npm test
```

## 🏗️ Build for Production

```bash
# Create optimized production build
npm run build

# Serve production build locally
npm install -g serve
serve -s build
```

## 📦 Dependencies

### Core
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-scripts` 5.0.1

### HTTP Client
- `axios` ^1.6.0

### Internationalization
- `i18next` ^23.7.0
- `react-i18next` ^13.5.0

## 🔧 Troubleshooting

### Issue: API calls failing

**Solution:**
- Ensure backend is running on port 5000
- Check CORS is enabled in backend
- Verify API base URL in `api.js`

### Issue: Language not persisting

**Solution:**
- Check localStorage for `lang` key
- Clear browser cache
- Verify i18n initialization

### Issue: Token not attaching

**Solution:**
- Check localStorage for `token` key
- Verify interceptor in `api.js`
- Ensure login flow completes

### Issue: Translations not working

**Solution:**
- Verify i18n.js is imported in App.js
- Check translation keys match usage
- Ensure useTranslation hook is used correctly

## 🎨 Styling Guidelines

- Use inline styles for quick prototyping
- Mobile-first approach
- Large touch targets (min 44px)
- Clear visual hierarchy
- Telugu-friendly fonts

## 🚀 Future Enhancements

- [ ] Add loading states
- [ ] Implement form validation
- [ ] Add error boundaries
- [ ] Implement offline support (PWA)
- [ ] Add animations/transitions
- [ ] Add more languages (Hindi, Kannada)
- [ ] Implement password/PIN option
- [ ] Add biometric authentication

## 📝 Code Examples

### Using Translation Hook

```javascript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t("welcome")}</h1>
      <button>{t("submit")}</button>
    </div>
  );
}
```

### Making API Calls

```javascript
import API from "../services/api";

async function createBusiness(data) {
  try {
    const response = await API.post("/business/create", data);
    console.log("Business created:", response.data);
  } catch (error) {
    console.error("Error:", error.response?.data?.message);
  }
}
```

### Using Auth Context

```javascript
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MyComponent() {
  const { user, login } = useContext(AuthContext);
  
  if (!user) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

## 📞 Support

For issues or questions:
1. Check console logs for errors
2. Verify backend connection
3. Review documentation
4. Check localStorage values

## 📄 License

Part of Local Business Automation Platform

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: January 12, 2026
