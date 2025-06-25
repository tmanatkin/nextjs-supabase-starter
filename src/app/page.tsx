"use client";

import { logout } from "./auth/actions";

export default function RootPage() {
  return (
    <div>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}
