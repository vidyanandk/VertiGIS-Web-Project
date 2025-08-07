import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Box from "@vertigis/web/ui/Box";
import Button from "@vertigis/web/ui/Button";
import IconButton from "@vertigis/web/ui/IconButton";
import Modal from "@vertigis/web/ui/Modal";
import Typography from "@vertigis/web/ui/Typography";

import FeatureAddingCM from "./FeatureAddingCM";
import type FeatureManagerModel from "./FeatureAddingCMModel";

export default function FeatureManager(props: LayoutElementProperties<FeatureManagerModel>) {
  const { model } = props;
  
  useWatchAndRerender(model, "isAddFeatureDialogOpen");
  useWatchAndRerender(model, "addFeatureModel");

  return (
    <LayoutElement {...props}>
      <Box style={{ padding: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => model.openAddFeatureDialog()}
          size="small"
        >
          Add Feature to Location
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => model.loadLocationLayers()}
          size="small"
        >
          Load Location Layers
        </Button>
      </Box>

      {/* Add Feature Dialog/Modal */}
      <Modal
        open={model.isAddFeatureDialogOpen}
        onClose={() => model.closeAddFeatureDialog()}
        aria-labelledby="add-feature-dialog-title"
      >
        <Box style={{ 
          position: 'relative',
          backgroundColor: 'white',
          padding: '0',
          borderRadius: '4px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {/* Dialog Header */}
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5'
          }}>
            <Typography variant="h6" id="add-feature-dialog-title">
              Feature Creator - DevMAINLOCATIONS
            </Typography>
            <IconButton
              onClick={() => model.closeAddFeatureDialog()}
              size="small"
              style={{ color: '#666' }}
            >
              ✕
            </IconButton>
          </Box>

          {/* Dialog Content */}
          <Box style={{ padding: '0' }}>
            {model.addFeatureModel && (
              <FeatureAddingCM model={model.addFeatureModel} />
            )}
          </Box>
        </Box>
      </Modal>
    </LayoutElement>
  );
}