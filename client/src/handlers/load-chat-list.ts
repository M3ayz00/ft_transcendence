import { getFriends } from "@/services/get-friends";
import { getUserById } from "@/services/get-user-by-id";
import { styles } from "@/styles/styles";
import { navigateTo } from "@/utils/navigate-to-link";
import { fontSizes } from "@/styles/fontSizes";
import { getUserTitle } from "@/utils/get-user-title";
import { getWelcomeTitle } from "@/components/home/Hero";
import { displayToast } from "@/utils/display-toast";

let onlineStatusMap: Record<number, boolean> = {};
let ws: WebSocket | null = null;

function renderChatList(profiles: any[]) {
  const chatListElement = document.getElementById("chat-list");
  if (!chatListElement) return;

  chatListElement.innerHTML = profiles
    .map((profile) => {
      if (!profile) return "";

      const isOnline = !!onlineStatusMap[profile.id];

      return `
      <li class="${styles.friendsListItemStyle}">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img src="${profile.avatar_url}" alt="${profile.username}'s avatar"
              class="${styles.friendsAvatarStyle}" />
            <span class="
              absolute bottom-0 right-0 block w-3 h-3 rounded-full
              ring-2 ring-[#1c1d22]
              ${isOnline ? "bg-pong-success" : "bg-gray-500"}
            " title="${isOnline ? "Online" : "Offline"}"></span>
          </div>
          <div class="flex flex-col">
            <span class="${
              fontSizes.bodyFontSize
            } font-semibold text-white normal-case">
              ${getWelcomeTitle(profile)} ${profile.username}
            </span>
            <span class="text-xs md:text-sm text-pong-dark-secondary">
              ${getUserTitle(profile.rank)}
            </span>
          </div>
        </div>

        <button
          class="
            p-2 rounded-full
            hover:bg-pong-dark-highlight/20
            transition-all duration-200
            text-pong-dark-primary hover:text-pong-accent
          "
          data-chat-id="${profile.id}"
        >
          <i class="fa-solid fa-message text-lg md:text-2xl"></i>
        </button>
      </li>
      `;
    })
    .join("");

  Array.from(chatListElement.querySelectorAll("button[data-chat-id]")).forEach(
    (btn) => {
      btn.addEventListener("click", (e) => {
        const chatId = (e.currentTarget as HTMLButtonElement).getAttribute(
          "data-chat-id"
        );
        if (chatId) {
          navigateTo(`/lounge/${chatId}`);
        }
      });
    }
  );
}

export async function loadChatList() {
  const chatListElement = document.getElementById("chat-list");
  if (!chatListElement) return;

  const friendIds = await getFriends();

  if (!friendIds.length) {
    chatListElement.innerHTML =
      '<li class="text-pong-dark-secondary text-center py-4 text-sm md:text-lg">No friends found.</li>';
    return;
  }

  const profiles = await Promise.all(friendIds.map((id) => getUserById(id)));

  renderChatList(profiles);

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    ws = new WebSocket(`wss://${window.location.host}/profile/statuses`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.userStatuses) {
          onlineStatusMap = {};
          data.userStatuses.forEach(
            (u: { userId: number; isOnline: boolean }) => {
              onlineStatusMap[u.userId] = u.isOnline;
            }
          );
          renderChatList(profiles);
        }
      } catch (error) {
        displayToast(
          "The club’s lights are out at the moment. Try again shortly.",
          "error"
        );
      }
    };
    ws.onerror = () => {
      displayToast(
        "The club’s lights are out at the moment. Try again shortly.",
        "error"
      );
      console.error("error in profiles status");
    };
    ws.onclose = () => {
		console.log("connection to status service ws clodsed");
	};
  }
}
