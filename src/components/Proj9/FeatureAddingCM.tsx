/* eslint-disable no-void */
import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import Button from "@vertigis/web/ui/Button";

import type FeatureAddingCMModel from "./FeatureAddingCMModel";

export default function Project9(props: LayoutElementProperties<FeatureAddingCMModel>) {
    const { model } = props;
    return (
        <LayoutElement {...props}>
            <Button onClick={() => void model.addFeatureLayer()}>Add Location Layer</Button>
        </LayoutElement>
    );
}
