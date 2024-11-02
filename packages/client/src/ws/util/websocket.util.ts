import { getRandomValues, subtle } from 'uncrypto';

export function generateRequestId() {
  return `sb:client:req:${Date.now()}-${getRandomValues(new Uint32Array(12))[0]}`;
}

export function getCloseEventReason(event: CloseEvent) {
  let reason;
  if (event.code == 1000)
    reason = 'Connection closed.';
  else if (event.code == 1001)
    reason = 'Endpoint is "going away".';
  else if (event.code == 1002)
    reason = 'Connection closed due to a protocol error.';
  else if (event.code == 1003 || event.code == 1007 || event.code == 1008 || event.code == 1010)
    reason = 'Bad request.';
  else if (event.code == 1004)
    reason = 'Reserved';
  else if (event.code == 1005)
    reason = 'Missing status code.';
  else if (event.code == 1006)
    reason ='The connection was closed abnormally.';
  else if (event.code == 1009)
    reason = 'Message size limit exceeded.';
  else if (event.code == 1011)
    reason = 'Server terminated connection because due to unexpected condition.'
  else if (event.code == 1015)
    reason = 'TLS handshake failure';
  else reason = 'Unknown error';

  return reason;
}

/**
 * Wraps a promise with a timeout.
 *
 * @param promise
 * @param timeout
 * @param options
 * @returns
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  options: { timeout: number; message?: string; controller: AbortController; signal?: AbortSignal },
): Promise<void | Awaited<T>> {
  const {
    timeout,
    message = 'Operation timed out.',
    controller
  } = options;
  let timeoutId: NodeJS.Timeout;
  return await Promise.race([
    new Promise<void>((_, rej) => {
      timeoutId = setTimeout(() => {
        controller.abort();
        console.debug('[withTimeout] timeout reached', options);
        return rej(new Error(message));
      }, timeout);

      options.signal?.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        controller?.abort();
        rej(new Error('Operation aborted.'));
      }, { once: true });
    }),
    promise,
  ]).finally(() => {
    clearTimeout(timeoutId);
    controller.abort();
  });
}

export async function sha256base64(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hexToBase64(hashHex);
}

function hexToBase64(hexString: string): string {
  // Convert the hex string to a Uint8Array
  // @ts-expect-error - :)
  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  // Convert the Uint8Array to a base64 string
  const base64String = btoa(String.fromCharCode.apply(null, Array.from(byteArray)));

  return base64String;
}