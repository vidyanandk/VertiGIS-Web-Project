import type { ComponentModelProperties, PropertyDefs } from "@vertigis/web/models";
import { ComponentModelBase, serializable } from "@vertigis/web/models";
import { inject } from "@vertigis/web/services";

import type Project8Service from "../../services/Services8/Service8";

interface Project8Properties extends ComponentModelProperties {
    openComponent?: boolean;
    input?: number;
}

@serializable
export default class Project8Model extends ComponentModelBase<Project8Properties> {
    /**
     * Whether the modal component is currently visible.
     */
    openComponent = false;

    /**
     * User-provided number input.
     */
    input = 0;

    /**
     * Injected service from the service container.
     */
    @inject("project-8.service")
    project8?: Project8Service;

    
    async triggerConfirmationAlert(value: number): Promise<void> {
        try {
            await this.messages
                .operation<number>("project-8.alertconfirmNumber")
                .execute(value);
        } catch (error) {
            console.error("Failed to execute alert confirmation:", error);
        }
    }

    protected _getSerializableProperties(): PropertyDefs<Project8Properties> {
        const props = super._getSerializableProperties();
        return {
            ...props,
            openComponent: {
                serializeModes: ["initial"],
                default: false,
            },
            input: {
                serializeModes: ["initial"],
                default: 0,
            },
        };
    }
}
