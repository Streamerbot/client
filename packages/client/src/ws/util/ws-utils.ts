import crypto from 'isomorphic-webcrypto';

export function generateRequestId() {
  return `sb:client:req:${Date.now()}-${crypto.getRandomValues(new Uint32Array(12))[0]}`;
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