import { Message } from "@/model/User.model";

export interface ApiResponse {
  Success: boolean;
  message: string;
  aitext: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}
