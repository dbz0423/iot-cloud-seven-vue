import { ref, onUnmounted } from 'vue'
import { ElNotification } from 'element-plus'

interface WebSocketOptions {
  url: string
  onMessage: (data: any) => void
  onError?: (event: Event) => void
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
}

export function useWebSocket({ url, onMessage, onError, onOpen, onClose }: WebSocketOptions) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)

  let reconnectTimer: NodeJS.Timeout | null = null
  let heartbeartTimer: NodeJS.Timeout | null = null

  const connect = () => {
    try {
      ws.value = new WebSocket(url)

      ws.value.onopen = (event) => {
        isConnected.value = true
        ElNotification({
          title: 'WebSocket',
          message: '连接成功',
          type: 'success'
        })
        if (onOpen) onOpen(event)

        // 心跳检测
        heartbeartTimer = setInterval(() => {
          if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            ws.value.send(JSON.stringify({ type: 'heartbeat' }))
          }
        }, 30000) // 30秒一次心跳
      }

      ws.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch (error) {
          console.error('WebSocket message parsing error:', error)
        }
      }

      ws.value.onerror = (event) => {
        console.error('WebSocket error:', event)
        if (onError) onError(event)
      }

      ws.value.onclose = (event) => {
        isConnected.value = false
        ElNotification({
          title: 'WebSocket',
          message: '连接已断开',
          type: 'warning'
        })
        if (onClose) onClose(event)

        // 清理定时器
        if (heartbeartTimer) clearInterval(heartbeartTimer)
        // 尝试重连
        if (reconnectTimer) clearTimeout(reconnectTimer)
        reconnectTimer = setTimeout(connect, 5000) // 5秒后重连
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
    }
  }

  const disconnect = () => {
    if (ws.value) {
      // 清理所有定时器
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (heartbeartTimer) clearInterval(heartbeartTimer)
      reconnectTimer = null
      heartbeartTimer = null

      ws.value.close()
      ws.value = null
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    isConnected,
    ws
  }
}
