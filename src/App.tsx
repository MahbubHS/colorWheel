import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { toast } from "sonner"

import { Button } from "../components/ui/button";

function App() {
  return (
    <div className="flex my-5 justify-between mx-2">
      <Select>
        <SelectTrigger className="w-[120px] bg-gray-100/50">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button>Click me!</Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", { position: "bottom-center" })
        }
      >
        Bottom Center
      </Button>
    </div>
  )
}

export default App;
