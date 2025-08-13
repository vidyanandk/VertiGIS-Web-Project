// eslint-disable-next-line import/no-duplicates
import type { PropertyDefs} from "@vertigis/web/models";
// eslint-disable-next-line import/no-duplicates
import { serializable, type ServiceModelProperties } from "@vertigis/web/models";
import { ConfigurableServiceBase } from "@vertigis/web/services";

interface MapDefinitionModelProperties extends ServiceModelProperties {
    mapDefinition?: object;
}





@serializable
export default class MapDefinitionDataService extends ConfigurableServiceBase<MapDefinitionModelProperties> {
    mapDefinition: object;
    // protected async setUserPreferences() {
    //     if (this.mapDefinition['userSettings']?.['userPreferences']) {
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //       await this.messages.commands.ui.setDensity.execute(this.mapDefinition['userSettings']?.['userPreferences']?.['view']);
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //       await this.messages.commands.region.setMeasurementSystem.execute(this.mapDefinition['userSettings']?.['userPreferences']?.['measurementSystem'] || "metric");
    //     } else {
    //       await this.messages.commands.ui.setDensity.execute("standard");
    //       await this.messages.commands.region.setMeasurementSystem.execute("metric");
    //     }
    //   }

    //   protected _getSerializableProperties(): PropertyDefs<MapDefinitionModelProperties> {
    //       return {
    //         ...super._getSerializableProperties(),
    //         mapDefinition: {serializeModes : ["initial"], default: {}}
    //       }
    //   }

}