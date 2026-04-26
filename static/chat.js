let messageCount = 0;
let isLoading = false;
let chatTitle = "New Conversation";
let chatHistory = JSON.parse(localStorage.getItem("shopsense_history") || "[]");

window.addEventListener("DOMContentLoaded", () => {
    renderHistory();
});

async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();

    if (!text || isLoading) return;

    if (messageCount === 0) {
        document.getElementById("welcome-screen").style.display = "none";
        chatTitle = text.length > 40 ? text.slice(0, 40) + "..." : text;
        document.getElementById("topbar-title").textContent = chatTitle;
    }

    input.value = "";
    input.style.height = "auto";
    messageCount++;

    appendMessage("user", text);

    const loadingId = showTyping();

    isLoading = true;
    document.getElementById("send-btn").disabled = true;

    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    removeTyping(loadingId);
    appendMessage("bot", data.response);

    isLoading = false;
    document.getElementById("send-btn").disabled = false;

    if (messageCount === 1) {
        saveToHistory(chatTitle);
    }
}

function appendMessage(role, text) {
    const messages = document.getElementById("messages");

    const wrapper = document.createElement("div");
    wrapper.className = `message ${role}`;

    const avatar = document.createElement("div");
    avatar.className = `avatar ${role}`;
    avatar.textContent = role === "bot" ? "S" : "You";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = formatText(text);

    const meta = document.createElement("div");
    meta.className = "msg-meta";
    meta.textContent = getTime();

    const inner = document.createElement("div");
    inner.appendChild(bubble);
    inner.appendChild(meta);

    wrapper.appendChild(avatar);
    wrapper.appendChild(inner);

    messages.appendChild(wrapper);
    scrollToBottom();
}

function showTyping() {
    const messages = document.getElementById("messages");
    const id = "typing-" + Date.now();

    const wrapper = document.createElement("div");
    wrapper.className = "message bot";
    wrapper.id = id;

    const avatar = document.createElement("div");
    avatar.className = "avatar bot";
    avatar.textContent = "S";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    scrollToBottom();

    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function formatText(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: var(--accent); text-decoration: underline;">$1</a>');
}

function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
}

function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function useChip(el) {
    document.getElementById("user-input").value = el.textContent;
    sendMessage();
}

function scrollToBottom() {
    const area = document.getElementById("chat-area");
    area.scrollTop = area.scrollHeight;
}

function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function clearChat() {
    document.getElementById("messages").innerHTML = "";
    document.getElementById("welcome-screen").style.display = "flex";
    document.getElementById("topbar-title").textContent = "New Conversation";
    messageCount = 0;
    chatTitle = "New Conversation";
}

function newChat() {
    clearChat();
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".nav-item")[0].classList.add("active");
}

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("collapsed");
}

function saveToHistory(title) {
    chatHistory.unshift({ title, time: Date.now() });
    if (chatHistory.length > 10) chatHistory.pop();
    localStorage.setItem("shopsense_history", JSON.stringify(chatHistory));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById("chat-history");
    const label = container.querySelector(".history-label");
    container.innerHTML = "";
    container.appendChild(label);

    if (chatHistory.length === 0) return;

    chatHistory.forEach(item => {
        const btn = document.createElement("button");
        btn.className = "history-item";
        btn.textContent = item.title;
        btn.title = item.title;
        container.appendChild(btn);
    });
}

function showFAQ() {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    event.target.closest(".nav-item").classList.add("active");

    const faqs = [
        "What is your return policy?",
        "How long does shipping take?",
        "Do you offer free shipping?",
        "How do I track my order?",
        "What payment methods do you accept?",
        "Can I cancel my order after placing it?"
    ];

    document.getElementById("user-input").value = "What are your most common FAQ topics?";
}

function showSuggestions() {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    event.target.closest(".nav-item").classList.add("active");
    document.getElementById("user-input").value = "Show me your most popular products";
    document.getElementById("user-input").focus();
}