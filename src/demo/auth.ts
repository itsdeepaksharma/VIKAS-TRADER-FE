import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';
import {
  demoAdminUser,
  demoBuyerUser,
  demoDelay,
  demoTokenForUser,
} from './constants';
import { throwDemoError } from './errors';
import { getDemoStore, nextDemoId, updateDemoStore } from './store';

function authResponse(user: typeof demoBuyerUser): AuthResponse {
  return {
    access_token: demoTokenForUser(user.id),
    token_type: 'bearer',
    user,
  };
}

function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return getDemoStore().users.find((u) => u.email.toLowerCase() === normalized);
}

export async function demoLogin(payload: LoginPayload): Promise<AuthResponse> {
  await demoDelay();
  const user = findUserByEmail(payload.email);
  const store = getDemoStore();
  const expected = store.passwords[payload.email.trim().toLowerCase()];

  if (!user || !expected || expected !== payload.password) {
    throwDemoError(401, 'Incorrect email or password');
  }

  if (!user.is_active) {
    throwDemoError(403, 'Account is inactive.');
  }

  return authResponse(user);
}

export async function demoRegister(payload: RegisterPayload): Promise<AuthResponse> {
  await demoDelay();
  if (findUserByEmail(payload.email)) {
    throwDemoError(400, 'An account with this email already exists.');
  }

  const user = {
    id: nextDemoId('demo-user'),
    email: payload.email.trim().toLowerCase(),
    first_name: payload.first_name.trim(),
    last_name: payload.last_name.trim(),
    phone: payload.phone.trim(),
    address: payload.address.trim(),
    is_active: true,
    is_superuser: false,
  };

  updateDemoStore((state) => ({
    ...state,
    users: [...state.users, user],
    adminUsers: [
      ...state.adminUsers,
      { ...user, created_at: new Date().toISOString() },
    ],
    passwords: {
      ...state.passwords,
      [user.email]: payload.password,
    },
  }));

  return authResponse(user);
}

export async function demoForgotPassword(email: string): Promise<void> {
  await demoDelay();
  if (!findUserByEmail(email)) {
    throwDemoError(404, 'No account found with this email.');
  }
}

export async function demoResetPassword(email: string, newPassword: string): Promise<void> {
  await demoDelay();
  const normalized = email.trim().toLowerCase();
  const user = findUserByEmail(email);
  if (!user) {
    throwDemoError(404, 'No account found with this email.');
  }

  updateDemoStore((state) => ({
    ...state,
    passwords: { ...state.passwords, [normalized]: newPassword },
  }));
}

export { demoBuyerUser, demoAdminUser };
