/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { LayoutElementProperties } from "@vertigis/web/components";
import { LayoutElement } from "@vertigis/web/components";
import { useWatchAndRerender } from "@vertigis/web/ui";
import Box from "@vertigis/web/ui/Box";
import Button from "@vertigis/web/ui/Button";
import FormControl from "@vertigis/web/ui/FormControl";
import MenuItem from "@vertigis/web/ui/MenuItem";
import Select from "@vertigis/web/ui/Select";
import Typography from "@vertigis/web/ui/Typography";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Key, useEffect, useState } from "react";

import "./FeatureAddingCM.css";
import type AddFeatureComponentModel from "./AddFeatureComponentModel";

interface AddFeatureComponentProps {
  model: AddFeatureComponentModel;
}

export default function AddFeatureComponent(props: AddFeatureComponentProps | LayoutElementProperties<AddFeatureComponentModel>) {
  // Handle both direct model prop and LayoutElementProperties pattern
  const model = 'model' in props ? props.model : (props as any).model;
  
  
  useWatchAndRerender(model, "selectedGeometryType");
  useWatchAndRerender(model, "featureLayers");
  useWatchAndRerender(model, "selectedLayer");
  useWatchAndRerender(model, "isLoading");
  useWatchAndRerender(model, "totalFeatures");

  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [featureCategory, setFeatureCategory] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [polygonCoords, setPolygonCoords] = useState("");
  const [polylineCoords, setPolylineCoords] = useState("");

  useEffect(() => {
    model.initialize();
  }, [model]);

  const handleGeometryTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const type = event.target.value as "point" | "polyline" | "polygon";
    model.setGeometryType(type);
  };

  const handleLayerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const layerId = event.target.value as string;
    const layer = model.featureLayers.find((l: { id: string; }) => l.id === layerId) || null;
    model.selectLayer(layer);
  };

  const handleAddFeature = async () => {
    try {
      let geometry: any = null;

      switch (model.selectedGeometryType) {
        case "point":
          if (!longitude || !latitude) {
            await model.showNotification("Please enter valid longitude and latitude for point geometry", "warning");
            return;
          }
          geometry = {
            type: "point",
            longitude: parseFloat(longitude),
            latitude: parseFloat(latitude)
          };
          break;

        case "polygon":
          if (!polygonCoords) {
            await model.showNotification("Please enter polygon coordinates", "warning");
            return;
          }
          try {
            const coords = JSON.parse(polygonCoords);
            geometry = {
              type: "polygon",
              coordinates: coords
            };
           
          } catch (e) {
            await model.showNotification("Invalid polygon coordinates format", "error");
            return;
          }
          break;

        case "polyline":
          if (!polylineCoords) {
            await model.showNotification("Please enter polyline coordinates", "warning");
            return;
          }
          try {
            const coords = JSON.parse(polylineCoords);
            geometry = {
              type: "polyline", 
              coordinates: coords
            };
          } catch (e) {
            await model.showNotification("Invalid polyline coordinates format", "error");
            return;
          }
          break;
      }

      const attributes = {
        Name: featureName,
        Description: featureDescription,
        Category: featureCategory
      };

      const success = await model.addFeatureToLayer(geometry, attributes);
      
      if (success) {
        // Clear form after successful addition
        setFeatureName("");
        setFeatureDescription("");
        setFeatureCategory("");
        setLongitude("");
        setLatitude("");
        setPolygonCoords("");
        setPolylineCoords("");
      }

    } catch (error) {
      console.error("Error adding feature:", error);
    }
  };

  const handleAddHardcodedFeature = async () => {
    const attributes = {
      Name: featureName || "Sample Feature",
      Description: featureDescription || "Hardcoded feature for testing",
      Category: featureCategory || "Test"
    };

    await model.createHardcodedFeature(attributes);
  };

  const handleClearFeatures = async () => {
    await model.clearAllFeatures();
  };

  const handleZoomToFeatures = async () => {
    await model.zoomToAllFeatures();
  };

  const renderGeometryInputs = () => {
    switch (model.selectedGeometryType) {
      case "point":
        return (
          <LayoutElement className="geometry-inputs" preloadChildren={function (): Promise<void> {
            throw new Error("Function not implemented.");
          } }>
            <Box className="input-group">
              <Typography variant="body2" className="input-label">Longitude</Typography>
              <input
                type="number"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                placeholder="-118.2437"
                className="custom-input"
              />
            </Box>
            <Box className="input-group">
              <Typography variant="body2" className="input-label">Latitude</Typography>
              <input
                type="number"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                placeholder="34.0522"
                className="custom-input"
              />
            </Box>
          </LayoutElement>
        );

      case "polygon":
        return (
          <Box className="input-group">
            <Typography variant="body2" className="input-label">
              Polygon Coordinates (JSON)
            </Typography>
            <textarea
              value={polygonCoords}
              onChange={e => setPolygonCoords(e.target.value)}
              placeholder='[[[-118.3, 34.1], [-118.2, 34.1], [-118.2, 34.0], [-118.3, 34.0], [-118.3, 34.1]]]'
              className="custom-textarea coordinate-input"
              rows={4}
            />
            <Typography variant="caption" color="textSecondary">
              Enter polygon coordinates as JSON array of rings
            </Typography>
          </Box>
        );

      case "polyline":
        return (
          <Box className="input-group">
            <Typography variant="body2" className="input-label">
              Polyline Coordinates (JSON)
            </Typography>
            <textarea
              value={polylineCoords}
              onChange={e => setPolylineCoords(e.target.value)}
              placeholder='[[-118.3, 34.1], [-118.25, 34.05], [-118.2, 34.0]]'
              className="custom-textarea coordinate-input"
              rows={3}
            />
            <Typography variant="caption" color="textSecondary">
              Enter polyline coordinates as JSON array of points
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="add-feature-container">
        <Typography variant="h6" className="add-feature-title">
          Add Feature to DevMAINLOCATIONS
        </Typography>

        {/* Feature Layer Selection */}
        <Box className="add-feature-section">
          <Typography variant="subtitle1">Target Layer</Typography>
          <FormControl fullWidth size="small">
            <Typography variant="body2">Select Feature Layer</Typography>
            <Select
              value={model.selectedLayer?.id || ""}
              onChange={(e: any) => handleLayerChange(e)}
              label="Select Feature Layer"
            >
              {model.featureLayers.map((layer: { id: Key | readonly string[]; title: any; }) => {
                // Ensure id is string or number for key and value
                const idStr = Array.isArray(layer.id) ? layer.id.join(",") : String(layer.id);
                return (
                  <MenuItem key={idStr} value={idStr}>
                    {layer.title || idStr}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {model.totalFeatures !== null && (
            <Typography variant="caption" color="textSecondary">
              Total Features: {model.totalFeatures}
            </Typography>
          )}
        </Box>

        {/* Feature Information */}
        <Box className="add-feature-section">
          <Typography variant="subtitle1">Feature Information</Typography>
          <Box className="input-group">
            <Typography variant="body2" className="input-label">Name *</Typography>
            <input
              type="text"
              value={featureName}
              onChange={e => setFeatureName(e.target.value)}
              placeholder="Enter feature name"
              className="custom-input"
              required
            />
          </Box>
          <Box className="input-group">
            <Typography variant="body2" className="input-label">Category</Typography>
            <input
              type="text"
              value={featureCategory}
              onChange={e => setFeatureCategory(e.target.value)}
              placeholder="Enter category"
              className="custom-input"
            />
          </Box>
          <Box className="input-group">
            <Typography variant="body2" className="input-label">Description</Typography>
            <textarea
              value={featureDescription}
              onChange={e => setFeatureDescription(e.target.value)}
              placeholder="Enter description"
              className="custom-textarea"
              rows={2}
            />
          </Box>
        </Box>

        {/* Geometry Type Selection */}
        <Box className="add-feature-section">
          <Typography variant="subtitle1">Geometry Configuration</Typography>
          <FormControl fullWidth size="small">
            <Typography variant="body2">Select Geometry Type</Typography>
            <Select
              value={model.selectedGeometryType}
              onChange={(e: any) => handleGeometryTypeChange(e)}
              label="Select Geometry Type"
            >
              <MenuItem value="point">Point</MenuItem>
              <MenuItem value="polyline">Polyline</MenuItem>
              <MenuItem value="polygon">Polygon</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Geometry Inputs */}
        <Box className="add-feature-section">
          <Typography variant="subtitle1">Coordinates</Typography>
          {renderGeometryInputs()}
        </Box>

        {/* Action Buttons */}
        <Box className="add-feature-section">
          <Typography variant="subtitle1">Actions</Typography>
          <Box className="feature-buttons">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFeature}
              disabled={model.isLoading || !featureName}
              fullWidth
              style={{ marginBottom: 8 }}
            >
              {model.isLoading ? "Adding..." : "Add Manual Feature"}
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleAddHardcodedFeature}
              disabled={model.isLoading}
              fullWidth
              style={{ marginBottom: 8 }}
            >
              Add Hardcoded Feature
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleZoomToFeatures}
              disabled={model.isLoading}
              fullWidth
              style={{ marginBottom: 8 }}
            >
              Zoom to Features
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleClearFeatures}
              disabled={model.isLoading}
              fullWidth
            >
              Clear All Features
            </Button>
          </Box>
        </Box>

        {/* Status Information */}
        <Box className="add-feature-section">
          <Typography variant="caption" color="textSecondary">
            Selected: {model.selectedGeometryType} | 
            Layer: {model.selectedLayer?.title || "None"} | 
            Status: {model.isLoading ? "Loading..." : "Ready"}
          </Typography>
        </Box>
      </Box>
  );
}