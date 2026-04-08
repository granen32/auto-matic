# Vue 3 Router Layout 전체 샘플

Vue 3에서 `home`, `about`, `dashboard`, `login` 같은 페이지를 라우터로 관리할 때는 보통 아래처럼 구성합니다.

- `App.vue`: 앱 전체의 최상위 껍데기
- `Layout 컴포넌트`: 공통 UI 묶음 관리
- `router-view`: 현재 라우트에 맞는 페이지 렌더링
- `children`: 특정 레이아웃 안에서 하위 페이지 교체

즉, `Dashboard`처럼 사이드바나 헤더를 공통으로 쓰는 영역은 `DashboardLayout.vue`를 만들고, 그 안에서 하위 페이지들만 바뀌게 하면 됩니다.

## 폴더 구조

```bash
src/
├─ App.vue
├─ main.js
├─ router/
│  └─ index.js
├─ layouts/
│  ├─ DefaultLayout.vue
│  ├─ DashboardLayout.vue
│  └─ AuthLayout.vue
├─ components/
│  ├─ AppHeader.vue
│  ├─ AppFooter.vue
│  └─ DashboardSidebar.vue
└─ views/
   ├─ HomeView.vue
   ├─ AboutView.vue
   ├─ LoginView.vue
   └─ dashboard/
      ├─ DashboardHomeView.vue
      ├─ UsersView.vue
      └─ SettingsView.vue
```

## 핵심 개념

- `App.vue`는 보통 최상위에서 `<router-view />`만 렌더링
- 각 `layout`은 공통 헤더, 푸터, 사이드바를 담당
- 각 `layout` 내부의 `<router-view />`에 실제 페이지가 들어감
- `dashboard`처럼 특정 그룹만 공통 UI를 써야 하면 `children`으로 묶음

---

## 1. `main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

## 2. `App.vue`

```vue
<template>
  <router-view />
</template>
```

## 3. `router/index.js`

```js
import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '../layouts/DefaultLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'

import DashboardHomeView from '../views/dashboard/DashboardHomeView.vue'
import UsersView from '../views/dashboard/UsersView.vue'
import SettingsView from '../views/dashboard/SettingsView.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'about',
        name: 'about',
        component: AboutView,
      },
    ],
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
      },
    ],
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard-home',
        component: DashboardHomeView,
      },
      {
        path: 'users',
        name: 'dashboard-users',
        component: UsersView,
      },
      {
        path: 'settings',
        name: 'dashboard-settings',
        component: SettingsView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

## 4. `layouts/DefaultLayout.vue`

```vue
<template>
  <div>
    <AppHeader />
    <main class="container">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<style scoped>
.container {
  padding: 24px;
}
</style>
```

## 5. `layouts/AuthLayout.vue`

```vue
<template>
  <div class="auth-layout">
    <div class="auth-box">
      <h1>Auth Page</h1>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f4f4;
}

.auth-box {
  width: 360px;
  padding: 32px;
  background: white;
  border-radius: 12px;
}
</style>
```

## 6. `layouts/DashboardLayout.vue`

```vue
<template>
  <div class="dashboard-layout">
    <DashboardSidebar />

    <div class="dashboard-main">
      <header class="dashboard-header">
        <h2>Dashboard</h2>
      </header>

      <section class="dashboard-content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import DashboardSidebar from '../components/DashboardSidebar.vue'
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.dashboard-main {
  flex: 1;
  background: #f8f9fb;
}

.dashboard-header {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.dashboard-content {
  padding: 24px;
}
</style>
```

## 7. `components/AppHeader.vue`

```vue
<template>
  <header class="header">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  padding: 16px 24px;
  background: #222;
}

nav {
  display: flex;
  gap: 16px;
}

a {
  color: white;
  text-decoration: none;
}
</style>
```

## 8. `components/AppFooter.vue`

```vue
<template>
  <footer class="footer">
    <p>Common Footer</p>
  </footer>
</template>

<style scoped>
.footer {
  padding: 16px 24px;
  background: #eee;
}
</style>
```

## 9. `components/DashboardSidebar.vue`

```vue
<template>
  <aside class="sidebar">
    <h3>Menu</h3>
    <nav>
      <RouterLink to="/dashboard">Dashboard Home</RouterLink>
      <RouterLink to="/dashboard/users">Users</RouterLink>
      <RouterLink to="/dashboard/settings">Settings</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  padding: 24px;
  background: #1f2937;
  color: white;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

a {
  color: white;
  text-decoration: none;
}
</style>
```

## 10. `views/HomeView.vue`

```vue
<template>
  <div>
    <h1>Home Page</h1>
    <p>기본 레이아웃이 적용된 홈 화면입니다.</p>
  </div>
</template>
```

## 11. `views/AboutView.vue`

```vue
<template>
  <div>
    <h1>About Page</h1>
    <p>이 페이지도 DefaultLayout 안에서 렌더링됩니다.</p>
  </div>
</template>
```

## 12. `views/LoginView.vue`

```vue
<template>
  <div>
    <p>로그인 페이지입니다.</p>
    <input type="text" placeholder="id" />
    <br /><br />
    <input type="password" placeholder="password" />
    <br /><br />
    <button>Login</button>
  </div>
</template>
```

## 13. `views/dashboard/DashboardHomeView.vue`

```vue
<template>
  <div>
    <h1>Dashboard Home</h1>
    <p>사이드바와 헤더는 유지되고 내용만 바뀝니다.</p>
  </div>
</template>
```

## 14. `views/dashboard/UsersView.vue`

```vue
<template>
  <div>
    <h1>Users</h1>
    <p>유저 목록 페이지</p>
  </div>
</template>
```

## 15. `views/dashboard/SettingsView.vue`

```vue
<template>
  <div>
    <h1>Settings</h1>
    <p>설정 페이지</p>
  </div>
</template>
```

---

## 렌더링 흐름

### `/about`

`App.vue`  
-> `DefaultLayout.vue`  
-> 그 안의 `<router-view>`에 `AboutView.vue`

### `/dashboard/users`

`App.vue`  
-> `DashboardLayout.vue`  
-> 그 안의 `<router-view>`에 `UsersView.vue`

즉,

- 앱 전체 통합 관리: `App.vue`
- 공통 영역 묶음 관리: `Layout 컴포넌트`
- `Dashboard` 안에서 공통 요소 유지: `DashboardLayout + children`

## 실무 팁

- 전체 공통 페이지는 `DefaultLayout`
- 로그인, 회원가입은 `AuthLayout`
- 관리자 페이지는 `DashboardLayout`
- 작은 공통 UI는 `components`로 분리
- 페이지 단위 공통 구조는 `layout`으로 분리

## 한 줄 정리

Vue 3에서 여러 페이지를 공통 구조로 관리할 때는 `App.vue` 위에 전부 넣는 게 아니라, `레이아웃 컴포넌트 + 중첩 라우트(children)` 구조로 나누는 게 일반적입니다.
