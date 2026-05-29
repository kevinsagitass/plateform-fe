interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  // Add all your other VITE_ variables here
  // readonly VITE_API_KEY: string;
  // readonly VITE_OTHER_VAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
