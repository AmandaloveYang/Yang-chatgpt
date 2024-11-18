<template>
  <div class="chat-page">
    <div class="page-container">
      <el-container class="chat-container">
        <div class="debug-info">
          <el-tag size="small" type="info"
            >消息数量: {{ userMessageCount }}</el-tag
          >
        </div>

        <el-main class="chat-messages" ref="messageContainer">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-wrapper', msg.role]"
          >
            <template v-if="msg.role === 'assistant'">
              <div class="avatar">
                <el-avatar
                  :size="40"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
              </div>
              <el-card class="message assistant-message" shadow="hover">
                <div class="message-content">{{ msg.content }}</div>
              </el-card>
            </template>

            <template v-else>
              <el-card class="message user-message" shadow="hover">
                <div class="message-content">{{ msg.content }}</div>
              </el-card>
            </template>
          </div>
        </el-main>

        <el-footer height="auto" class="input-area">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="3"
            placeholder="输入消息..."
            @keyup.enter.prevent="sendMessage"
          />
          <el-button type="primary" @click="sendMessage" :loading="loading">
            发送
          </el-button>
        </el-footer>
      </el-container>

      <div class="side-image">
        <div class="wechat-title">推荐使用微信支付</div>
        <img src="@/assets/yang.jpg" alt="Yang" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const messages = ref<Message[]>([]);
const userInput = ref("");
const loading = ref(false);

const userMessageCount = computed(() => {
  return messages.value.filter((msg) => msg.role === "user").length;
});

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return;

  loading.value = true;

  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    role: "user",
    content: userInput.value.trim(),
  };
  messages.value.push(userMessage);

  try {
    const response = await request<ChatResponse>({
      url: "/v1/chat/completions",
      method: "post",
      data: {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userInput.value,
          },
        ],
      },
    });

    // 添加AI响应
    if (response.choices && response.choices[0]?.message) {
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.choices[0].message.content,
      };
      messages.value.push(aiMessage);
      console.log("当前消息:", messages.value); // 调试输出
    }

    userInput.value = "";
  } catch (error) {
    console.error("发送消息失败:", error);
    ElMessage.error("发送消息失败，请重试");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 添加一条欢迎消息
  messages.value.push({
    id: Date.now(),
    role: "assistant",
    content: "你好！我是AI助手，有什么可以帮你的吗？",
  });
});
</script>

<style lang="less" scoped>
.chat-page {
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.page-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
}

.chat-container {
  flex: 1;
  height: calc(100vh - 40px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ddd;
      border-radius: 3px;
    }
  }

  .message-wrapper {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    width: 100%;

    &.assistant {
      justify-content: flex-start;

      .message {
        margin-right: 20%;
        background-color: #f4f4f5;
      }
    }

    &.user {
      justify-content: flex-end;

      .message {
        margin-left: 20%;
        background-color: #e6f4ff;
      }
    }

    .avatar {
      flex-shrink: 0;
      align-self: flex-start;
    }

    .message {
      max-width: 80%;
      border-radius: 12px;

      &.user-message {
        background-color: #e6f4ff;
      }

      &.assistant-message {
        background-color: #f4f4f5;
      }
    }
  }

  .input-area {
    padding: 16px 20px;
    border-top: 1px solid #ebeef5;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

    .el-textarea {
      margin-bottom: 12px;

      :deep(.el-textarea__inner) {
        border-radius: 8px;
        padding: 12px;
        min-height: 80px !important;
        resize: none;

        &:focus {
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
      }
    }

    .el-button {
      width: 100%;
      height: 40px;
      font-size: 14px;
      border-radius: 8px;

      &:not(.is-loading):hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.side-image {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .wechat-title {
    text-align: center;
    color: #00c853;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }
}

@media screen and (max-width: 1200px) {
  .side-image {
    display: none;
  }

  .chat-container {
    max-width: 800px;
  }
}

@media screen and (max-width: 768px) {
  .chat-page {
    padding: 10px;
  }

  .chat-container {
    height: calc(100vh - 20px);

    .message-wrapper {
      &.user {
        .message {
          margin-left: 10%;
        }
      }

      &.assistant {
        .message {
          margin-right: 10%;
        }
      }
    }
  }
}

.debug-info {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;

  .el-tag {
    font-size: 12px;
    border-radius: 4px;
  }
}
</style>
