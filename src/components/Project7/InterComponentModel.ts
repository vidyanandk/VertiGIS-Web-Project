import type { PropertyDefs, ComponentModelProperties } from "@vertigis/web/models";
import { ComponentModelBase, serializable } from "@vertigis/web/models";

interface Project7Properties extends ComponentModelProperties {
    openComponent?: boolean;
}

@serializable
export default class Project7Model extends ComponentModelBase<Project7Properties> {
    openComponent: boolean;


     
    protected _getSerializableProperties(): PropertyDefs<Project7Properties> {
        const props = super._getSerializableProperties();
        return {
            ...props,
            openComponent: {
                serializeModes: ["initial"],
                default: false,
            },
        };
    }
}
