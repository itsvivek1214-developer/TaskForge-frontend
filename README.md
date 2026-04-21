# TaskForge — AI-Powered Task Management Frontend

A production-grade React frontend for the TaskForge backend system. Dark industrial aesthetic with electric purple accents, built for developers.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local and set your backend URL:
# REACT_APP_API_URL=http://localhost:8080/api

# 3. Start development server
npm start
```

The app runs at **http://localhost:3000**

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.js              # Login page
│   │   ├── Register.js           # Registration page
│   │   ├── ProtectedRoute.js     # Auth guards
│   │   └── Auth.module.css       # Shared auth styles
│   ├── layout/
│   │   ├── AppLayout.js          # Root layout wrapper
│   │   ├── Sidebar.js            # Collapsible sidebar nav
│   │   ├── Header.js             # Page header with user info
│   │   └── *.module.css
│   ├── tasks/
│   │   ├── TaskCard.js           # Individual task card
│   │   ├── TaskForm.js           # Create/edit modal
│   │   ├── TaskDetail.js         # View task detail modal
│   │   ├── TaskFilters.js        # Search + filter toolbar
│   │   ├── KanbanColumn.js       # Kanban board column
│   │   └── *.module.css
│   ├── ai/
│   │   ├── AIPanel.js            # AI prioritize + suggest panel
│   │   └── AIPanel.module.css
│   └── common/
│       ├── Button.js             # Reusable button
│       ├── Input.js              # Text input
│       ├── Select.js             # Dropdown select
│       ├── Textarea.js           # Multiline input
│       ├── Modal.js              # Dialog modal
│       ├── Badge.js              # Priority/Status badges
│       ├── Spinner.js            # Loading states
│       ├── EmptyState.js         # Empty content placeholder
│       ├── ConfirmDialog.js      # Confirmation dialog
│       └── *.module.css
├── context/
│   ├── AuthContext.js            # JWT auth state + methods
│   └── TaskContext.js            # Task CRUD state
├── pages/
│   ├── Dashboard.js              # Overview with stats
│   ├── Tasks.js                  # Full task list (list/grid)
│   ├── Kanban.js                 # Kanban board view
│   └── AIAssistant.js            # AI features page
├── services/
│   └── api.js                    # Axios API client
├── utils/
│   └── helpers.js                # Utility functions
├── App.js                        # Router + providers
├── index.js                      # Entry point
└── index.css                     # Global CSS + design tokens
```

---

## 🔌 Backend API Contract

The frontend expects these endpoints (matching the Spring Boot spec):

### Auth
| Method | Endpoint            | Body                              | Response                    |
|--------|---------------------|-----------------------------------|-----------------------------|
| POST   | `/api/auth/register`| `{name, email, password}`         | `{message}`                 |
| POST   | `/api/auth/login`   | `{email, password}`               | `{token, user: {id, name, email, role}}` |

### Tasks
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/tasks`              | All tasks (supports `?status=&priority=&search=&page=&size=`) |
| POST   | `/api/tasks`              | Create task              |
| GET    | `/api/tasks/{id}`         | Get by ID                |
| PUT    | `/api/tasks/{id}`         | Update task              |
| DELETE | `/api/tasks/{id}`         | Delete task              |
| PATCH  | `/api/tasks/{id}/status`  | Update status            |

### AI
| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/tasks/prioritize`| Get priority suggestion  |
| POST   | `/api/tasks/suggest`   | Get AI suggestions       |

### Task Object Shape
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Details...",
  "priority": "HIGH | MEDIUM | LOW",
  "status": "TODO | IN_PROGRESS | DONE",
  "deadline": "2025-03-15T14:00:00",
  "createdAt": "2025-03-10T09:00:00",
  "updatedAt": "2025-03-12T11:30:00",
  "userId": 42
}
```

### Paginated Response (optional)
```json
{
  "content": [...tasks],
  "number": 0,
  "size": 20,
  "totalElements": 100
}
```
*(The frontend also handles plain arrays for simple backends)*

---

## 🎨 Design System

**Fonts** (loaded from Google Fonts):
- Display: `Syne` — headings, logo, stat numbers
- Body: `Cabinet Grotesk` — UI text, labels
- Mono: `DM Mono` — code, badges, metadata

**Color Tokens** (CSS variables in `index.css`):
- `--accent-primary: #6c63ff` — primary actions
- `--accent-red: #fc5c7d` — HIGH priority / danger
- `--accent-amber: #f7b731` — MEDIUM priority / warning
- `--accent-green: #43e97b` — LOW priority / success
- `--accent-cyan: #43cfea` — AI features

---

## 🔐 Authentication Flow

1. User submits login form → `POST /api/auth/login`
2. JWT token stored in `localStorage` as `taskforge_token`
3. All API requests include `Authorization: Bearer <token>`
4. 401 responses auto-redirect to `/login`
5. Token + user cleared on logout

---

## 📦 Key Dependencies

| Package           | Purpose                          |
|-------------------|----------------------------------|
| `react-router-dom`| Client-side routing              |
| `axios`           | HTTP client with interceptors    |
| `react-hot-toast` | Toast notifications              |
| `date-fns`        | Date formatting and comparison   |
| `lucide-react`    | Icon library                     |

---

## 🌐 Pages

| Route        | Component      | Description                        |
|--------------|----------------|------------------------------------|
| `/login`     | `Login`        | JWT login form                     |
| `/register`  | `Register`     | New account form                   |
| `/dashboard` | `Dashboard`    | Stats, recent tasks, urgent alerts |
| `/tasks`     | `Tasks`        | Full task list with filters        |
| `/kanban`    | `Kanban`       | Board view by status columns       |
| `/ai`        | `AIAssistant`  | AI priority + suggestion tools     |

---

## ⚙️ Customisation

**Change API base URL:**
```bash
# .env.local
REACT_APP_API_URL=https://your-backend.com/api
```

**Adjust priority rules (local fallback):**
Edit `src/utils/helpers.js` → `calculateLocalPriority()`

**Add new nav items:**
Edit `src/components/layout/Sidebar.js` → `navItems` array
