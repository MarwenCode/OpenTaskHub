const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = (payload = {}) => {
  const { username, email, password } = payload;

  if (!username || typeof username !== "string" || username.trim().length < 2) {
    return "Username must contain at least 2 characters";
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return "A valid email is required";
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password must contain at least 6 characters";
  }

  return null;
};

export const validateLoginInput = (payload = {}) => {
  const { email, password } = payload;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return "A valid email is required";
  }

  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  return null;
};

export const validateTaskInput = (payload = {}) => {
  const { title, workspaceId, status } = payload;

  if (!title || typeof title !== "string" || !title.trim()) {
    return "Title is required";
  }

  if (!workspaceId || typeof workspaceId !== "string" || !workspaceId.trim()) {
    return "workspaceId is required";
  }

  if (status && !["todo", "in_progress", "done"].includes(status)) {
    return "status must be one of: todo, in_progress, done";
  }

  return null;
};
