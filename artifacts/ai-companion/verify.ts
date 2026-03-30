import { chatService } from "./src/services/chat.service.js";

async function verify() {
  console.log("Starting verification...");

  // 1. Create session
  const session = await chatService.createSession("user_123", { userName: "Bob", level: 5 });
  console.log(`Created Session: ${session.chat_id}`);

  // 2. Add 5 messages to trigger a summary
  for (let i = 1; i <= 5; i++) {
    console.log(`Sending message ${i}...`);
    const resp = await chatService.processUserMessage(session.chat_id, `This is test message ${i} about learning math.`);
    console.log(`AI Reply: ${resp.substring(0, 50)}...`);
  }

  // 3. Check for summary
  const updated = await chatService.getSession(session.chat_id);
  console.log("\n--- Session Status ---");
  console.log(`Summary Triggered: ${!!updated?.context_summary}`);
  console.log("Summary Object:", updated?.context_summary);

  console.log("\nVerification complete.");
}

verify().catch(console.error);
