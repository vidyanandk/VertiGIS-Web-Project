import { command } from "@vertigis/web/messaging";
import { ServiceBase } from "@vertigis/web/services";

import {Position,NotificationCategory} from "../../comman/Interface/NotificationStyle";    

export default class project1Service extends ServiceBase{
    public async showNotification(
        message: string,
        position: Position.RIGHT,
      ): Promise<void> {
        await this.messages.commands.ui.displayNotification.execute({
          title: "My Click",
          message,
          position,
          category: NotificationCategory.ERROR
        });
      }

      @command("project1.confirm-me")
      protected async myCommand(): Promise<void> {
          await this.showNotification(`Project 1 Command Executed as: ${NotificationCategory.ERROR}`, Position.RIGHT);
          console.log(`Executing 'project1.confirm-me' command`);
    }
}

