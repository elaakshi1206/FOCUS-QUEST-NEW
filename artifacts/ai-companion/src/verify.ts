const API_URL = "http://localhost:3003/api/chat";

async function testFlows() {
  console.log("🚀 Starting FocusQuest AI Verification Flow...\n");

  const userId = "test_user_777";
  let chatId = "";

  // 1. Initial Greeting
  console.log("---- Test 1: New Chat Session ----");
  const msg1 = "Hello! I am ready to start my focus quest. Teach me!";
  console.log(`User: ${msg1}`);
  const res1 = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, message: msg1 }),
  });
  const data1 = await res1.json();
  console.log(`Finny: ${data1.assistant_reply}`);
  console.log(`Chat ID: ${data1.chat_id}\n`);

  chatId = data1.chat_id;

  // 2. Continuing context
  console.log("---- Test 2: Context Persistence ----");
  const msg2 = "Wait, what did I just say? Please remind me.";
  console.log(`User: ${msg2}`);
  const res2 = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, message: msg2, chat_id: chatId }),
  });
  const data2 = await res2.json();
  console.log(`Finny: ${data2.assistant_reply}\n`);
}

testFlows().catch(console.error);
