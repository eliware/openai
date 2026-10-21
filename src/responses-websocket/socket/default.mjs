import { WebSocket as NodeWebSocket } from "ws";

export function getDefaultSocketConstructor() {
  return NodeWebSocket;
}
