// Lightweight integration shim to satisfy imports during development.
// Replace with real implementations that call your backend services or third-party APIs.

export async function UploadFile(file, options = {}) {
  // Shim: return a minimal success-like object to let UI continue.
  return {
    success: true,
    file: {
      id: 'shim-file-1',
      name: file?.name || 'uploaded-file',
      url: null,
    },
    message: 'UploadFile shim: no-op in dev',
  };
}

export async function ExtractDataFromUploadedFile(fileIdOrFile, options = {}) {
  // Shim: return empty extracted data structure.
  return {
    success: true,
    data: {},
    message: 'ExtractDataFromUploadedFile shim: no data',
  };
}

export async function SendEmail(payload = {}) {
  // Shim: pretend email was queued/sent.
  return {
    success: true,
    message: 'SendEmail shim: no-op',
  };
}

export async function InvokeLLM(prompt, opts = {}) {
  // Support calling with either (promptString, opts) or ({ prompt: '...', ...opts })
  let thePrompt = prompt;
  let options = opts;
  if (typeof prompt === 'object' && prompt !== null && 'prompt' in prompt) {
    thePrompt = prompt.prompt;
    options = prompt;
  }

  // Shim: return a simple placeholder response string. Real integration should call an LLM service
  // and respect options such as model, provider, api keys, etc.
  if (typeof thePrompt === 'string') {
    return `Shim LLM response for: ${thePrompt.substring(0, 120)}`;
  }
  return 'Shim LLM response';
}

// Export default for any default imports (not expected but harmless)
export default {
  UploadFile,
  ExtractDataFromUploadedFile,
  SendEmail,
  InvokeLLM,
};
