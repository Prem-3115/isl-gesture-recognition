/**
 * hooks/useAuth.ts
 *
 * Purpose: Convenience hook to consume the AuthContext.
 * Components import useAuth from here, not the context directly.
 * This is the standard pattern — hooks as the public API, context as infrastructure.
 */

export { useAuth } from "../context/AuthContext";
