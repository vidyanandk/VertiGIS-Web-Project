import type { MapExtension } from "@vertigis/arcgis-extensions/mapping/MapExtension";
import type { PropertyDefs, ComponentModelProperties } from "@vertigis/web/models";
import { ComponentModelBase, importModel, serializable } from "@vertigis/web/models";


interface  BasemapOpacitySlidebarModelProperties extends ComponentModelProperties {
    opacity?: number;
}


@serializable
export default class BasemapOpacitySlidebarModel extends ComponentModelBase<BasemapOpacitySlidebarModelProperties> {
    opacity: number;


    

    @importModel("map-extension")
    mapExtension: MapExtension


    async handleOpacityChange(opacity: number) : Promise<void> {
        this.opacity = opacity;

        this.mapExtension.map.basemap.baseLayers.forEach(layer =>{
            layer.opacity = opacity;
        })
    }


    protected _getSerializableProperties(): PropertyDefs<BasemapOpacitySlidebarModelProperties> {
        const  props = super._getSerializableProperties();
        return {
            ...props,
            opacity: {
                serializeModes: ["initial"],
                default: 3
            }
        }
    }
}