import { operation } from "@vertigis/web/messaging";
import { ServiceBase } from "@vertigis/web/services";

export default class Project8Service extends ServiceBase {
    
    @operation("project-8.alertconfirmNumber")
    protected async showConfirmationAlert(value: number): Promise<void> {
        if (typeof value !== "number" || isNaN(value)) {
            console.warn("Invalid value passed to showConfirmationAlert:", value);
            return;
        }

        await this.messages.commands.ui.alert.execute({
            title: "Confirmation",
            message: `You entered the number: ${value}`,
        });
    }
}
