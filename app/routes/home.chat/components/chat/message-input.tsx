
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

type MessageInputProps = {
  onSend: () => void
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim()) {
      // Here you would typically send the message to your API
      console.log("Sending message:", message)
      setMessage("")
      onSend()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full"
      />
      <Button type="submit" size="icon" disabled={!message.trim()}>
        <SendIcon className="h-5 w-5" />
      </Button>
    </form>
  )
}
