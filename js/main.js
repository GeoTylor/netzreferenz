let netz = null;
let autobahnen = [];
let babSelect = null;
let absSelect = null;
let stationSlider = null;
let stationSliderTop = null;
let kilometerOutput = null;
let babOutput = null;
let absOutput = null;
let stationOutput = null;
let blockOutput = null;
let refOutput = null;
let aoaOutput = null;
let panOutput = null;
let utmOutput = null;
let latLonOutput = null;
let scaleOutput = null;
let referenzGraphic = null;
let referenzOverlay = null;
let copyHelpers = new Map();
let kilometerFilterInput = null;
let kilometerFilterApplyBtn = null;
let kilometerFilterMessage = null;
let kilometerFilterMessageText = null;
let kilometerFilterMessageBtn = null;
let kilometerFilterValue = null;
let kilometerFilterInvalid = false;
let kilometerFilterAutoConfirm = false;
let kilometerFilterResetPending = false;
let kilometerFilterClearOnReferenz = false;
let kilometerFilterClearOnClose = false;
let suppressSliderUpdate = false;
let absOptionsAll = [];
let absOptionsGlobal = [];
let absOptionsByBab = new Map();
let absOptionsByAoa = new Map();
let absOptgroupsAll = [];
let karteMap = null;
let karteMapAerialLayer = null;
let karteMapBaseLayer = null;
let karteLensToggleBtn = null;
let karteLensEnabled = false;
let karteLensResizeObserver = null;
let karteLensToggleResizeObserver = null;
let karteOutputTiles = null;
let karteAbschnittByAoa = new Map();
let karteAbschnittSource = null;
let karteAbschnittLayer = null;
let karteAbschnittFeatures = [];
let karteHighlightSource = null;
let karteNetzknotenSource = null;
let karteNetzknotenLayer = null;
let karteNetzknotenFeatures = [];
let karteAbschnittGeometryRevision = 0;
let karteAbschnittExtentFitted = false;
let karteInitialBabFitted = false;
let karteSearchActive = false;
let karteSearchDragging = false;
let karteSearchButton = null;
let karteSearchCrosshair = null;
let karteSearchFrame = null;
let karteSearchDot = null;
let karteSearchBar = null;
let karteSearchBarLabel = null;
let karteSearchCorners = [];
let karteSearchSnapping = false;
let karteSearchSnapTimeout = null;
let karteSearchSnapTarget = null;
let karteSearchDotFrame = null;
let karteSearchBarUpdateFrame = null;
let karteSearchHasUserInteraction = false;
let karteSearchSelectingAbschnitt = false;
let karteSearchPendingStationKm = null;
let karteSearchSuppressCenterUntil = 0;
let karteSearchGeocoderPending = false;
let karteGeocoder = null;
let karteGeocoderWrap = null;
let karteGeocoderInput = null;
let karteGeocoderSource = null;
let karteGeocoderSyncingMarker = false;
let karteScaleControl = null;
let kartePinchZooming = false;
let kartePinchCenter = null;
let stationSliderActive = false;
let lastAbschnittId = null;
let karteZoomCenterFrame = null;
let netzknotenMeasureContext = null;
let netzknotenSelectorIconCache = new Map();
let netzknotenTextMetricsCache = new Map();
let netzknotenBabCornerCache = new Map();
const COPY_STATUS_DURATION_MS = 1600;
const COPY_STATUS_FADE_MS = 180;
const copySuccessTickTargets = new Set([
  'babOutput',
  'absOutput',
  'stationOutput',
  'kilometerOutput',
  'blockOutput'
]);
let selectedAbschnittAoa = null;

const MAP_SEARCH_RADIUS_PX = 18;
const STATION_LOCK_ZOOM = 14;
const ABSCHNITT_LABEL_MIN_ZOOM = 10;
const ABSCHNITT_LABEL_MIN_PX = 90;
const ABSCHNITT_STROKE_COLOR = 'rgba(0, 90, 140, 0.9)';
const ABSCHNITT_HIGHLIGHT_COLOR = 'rgba(255, 130, 58, 0.76)';
const ABSCHNITT_LABEL_COLOR = '#627d98';
const ABSCHNITT_LABEL_HALO_COLOR = 'rgba(245, 247, 250, 0.9)';
const NETZKNOTEN_POINT_MIN_ZOOM = 10;
const NETZKNOTEN_LABEL_MIN_ZOOM = 10;
const NETZKNOTEN_FULL_LABEL_MIN_ZOOM = 13;
const NETZKNOTEN_LABEL_POINT_GAP_PX = 3;
const NETZKNOTEN_LABEL_SEARCH_PADDING_PX = 12;
const NETZKNOTEN_LABEL_FALLBACK_ANCHOR_X = 0;
const NETZKNOTEN_LABEL_FALLBACK_ANCHOR_Y = 1;
const NETZKNOTEN_SIGN_MAX_AS_CHARS = 42;
const NETZKNOTEN_ICON_TARGET_HEIGHT = 11;
const NETZKNOTEN_ICON_FALLBACK_WIDTH = 26;
const NETZKNOTEN_ICON_FALLBACK_HEIGHT = 21;
const NETZKNOTEN_SIGN_CONTENT_PAD_X = 6;
const NETZKNOTEN_SIGN_CONTENT_PAD_Y = 3;
const NETZKNOTEN_SIGN_MIN_WIDTH = 60;
const NETZKNOTEN_SIGN_MIN_HEIGHT = 26;
const NETZKNOTEN_KT_PILL_PADDING_X = 5;
const NETZKNOTEN_KT_PILL_PADDING_Y = 1.5;
const NETZKNOTEN_KT_PILL_MIN_HEIGHT = 12;
const NETZKNOTEN_LABEL_OPACITY = 0.9;
const BAB_SIGN_SHIELD_POLYGON_POINTS = '50 0,50 0,47.122 0.33,42.648 1.255,37.023 2.626,30.696 4.296,24.115 6.116,17.726 7.938,11.978 9.613,7.319 10.993,4.194 11.93,3.054 12.275,3.054 12.275,2.547 12.465,2.072 12.769,1.633 13.178,1.236 13.683,0.885 14.273,0.586 14.94,0.343 15.673,0.161 16.463,0.046 17.301,0.002 18.175,0 18.175,0 81.825,0.002 81.825,0.002 81.825,0.046 82.7,0.161 83.538,0.343 84.328,0.586 85.062,0.885 85.728,1.236 86.319,1.633 86.824,2.072 87.233,2.547 87.538,3.054 87.728,3.054 87.728,4.194 88.073,7.319 89.01,11.978 90.389,17.726 92.064,24.115 93.885,30.696 95.705,37.023 97.375,42.648 98.746,47.122 99.67,50 100,50 100,52.823 99.652,57.266 98.717,62.878 97.341,69.207 95.672,75.801 93.857,82.209 92.042,87.979 90.375,92.66 89.002,95.8 88.071,96.946 87.728,96.946 87.728,97.453 87.538,97.928 87.233,98.367 86.824,98.764 86.319,99.115 85.728,99.415 85.062,99.658 84.328,99.84 83.538,99.956 82.7,100 81.825,100 81.825,100 18.179,100 18.179,100 18.179,99.956 17.303,99.84 16.465,99.659 15.674,99.416 14.941,99.116 14.274,98.766 13.683,98.368 13.178,97.93 12.769,97.455 12.465,96.948 12.275,96.948 12.275,95.801 11.932,92.661 11,87.98 9.627,82.209 7.96,75.801 6.144,69.207 4.329,62.878 2.659,57.266 1.284,52.823 0.348,50 0,50 0';
const NETZKNOTEN_METRICS_SAMPLE = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÄÖÜäöüß';
const INITIAL_MAP_ZOOM = 10;
const INITIAL_BAB_FIT = 'A99';
const MAP_SEARCH_SNAP_MIN_DISTANCE = 1;
const MAP_SEARCH_SNAP_DURATION = 300;
const MAP_SEARCH_SNAP_TIMEOUT = 500;
const MAP_SEARCH_POST_SNAP_SUPPRESS_CENTER_MS = 250;
const GEOCODER_PAN_SUPPRESS_CENTER_MS = 700;
const GEOCODER_VIEWBOX_4326 = [8.156157, 46.731124, 14.65983, 51.103701];
const BAB_ALL_VALUE = '__ALL__';
const BAB_RESET_OPTION = {
  bab: BAB_ALL_VALUE,
  bdg: '',
  lbl: 'Zurücksetzen',
  vkt: '',
  vas: '',
  nkt: '',
  nas: '',
  $order: -1
};
const A99_EXTENT_BUFFER_RATIO = 0.08;
let suppressBabChange = false;
const GEOCODER_VIEWBOX = `${GEOCODER_VIEWBOX_4326[0]},${GEOCODER_VIEWBOX_4326[3]},${GEOCODER_VIEWBOX_4326[2]},${GEOCODER_VIEWBOX_4326[1]}`;

function createBayernGeocoderProvider() {
  return {
    getParameters({ query, limit, lang }) {
      return {
        url: 'https://nominatim.openstreetmap.org/search',
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: limit || 6,
          viewbox: GEOCODER_VIEWBOX,
          bounded: 1,
          'accept-language': lang || 'de-DE'
        }
      };
    },
    handleResponse(response) {
      if (!Array.isArray(response) || !response.length) return [];
      return response.map((item) => ({
        lon: item.lon,
        lat: item.lat,
        address: {
          name: item.display_name || '',
          road: item.address?.road || '',
          house_number: item.address?.house_number || '',
          postcode: item.address?.postcode || '',
          city: item.address?.city || item.address?.town || item.address?.village || '',
          state: item.address?.state || '',
          country: item.address?.country || ''
        },
        original: {
          formatted: item.display_name || '',
          details: item.address || {}
        }
      }));
    }
  };
}

function getNowMs() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

// Firefox/Edge may flicker when re-centering immediately after snap animation!
// Suppress center updates briefly during map-search selection sync.
function suppressMapSearchCenterFor(ms) {
  const duration = Number.isFinite(ms) ? ms : 0;
  if (duration <= 0) return;
  const until = getNowMs() + duration;
  if (!karteSearchSuppressCenterUntil || until > karteSearchSuppressCenterUntil) {
    karteSearchSuppressCenterUntil = until;
  }
}

function shouldSuppressMapSearchCenter() {
  if (karteSearchSelectingAbschnitt) return true;
  if (!karteSearchSuppressCenterUntil) return false;
  return getNowMs() < karteSearchSuppressCenterUntil;
}

function getKarteSearchFrameColor(mapTarget) {
  const target = mapTarget || document.getElementById('karteMap');
  if (!target || typeof window.getComputedStyle !== 'function') {
    return 'rgba(89, 143, 236, 0.9)';
  }
  const color = window.getComputedStyle(target).getPropertyValue('--snap-frame-color').trim();
  return color || 'rgba(89, 143, 236, 0.9)';
}

function buildKarteGeocoderMarkerIcon(color) {
  const markerColor = color || 'rgba(255, 130, 58, 0.85)';
  const haloColor = 'rgba(245, 247, 250, 0.9)';
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">',
    `<circle cx="12" cy="12" r="1.5" fill="${haloColor}" />`,
    `<circle cx="12" cy="12" r="8" stroke="${haloColor}" stroke-width="2" />`,
    `<line x1="12" y1="2" x2="12" y2="6" stroke="${haloColor}" stroke-width="2" stroke-linecap="round" />`,
    `<line x1="12" y1="18" x2="12" y2="22" stroke="${haloColor}" stroke-width="2" stroke-linecap="round" />`,
    `<line x1="2" y1="12" x2="6" y2="12" stroke="${haloColor}" stroke-width="2" stroke-linecap="round" />`,
    `<line x1="18" y1="12" x2="22" y2="12" stroke="${haloColor}" stroke-width="2" stroke-linecap="round" />`,
    `<circle cx="12" cy="12" r="1" fill="${markerColor}" />`,
    `<circle cx="12" cy="12" r="8" stroke="${markerColor}" stroke-width="1" />`,
    `<line x1="12" y1="2" x2="12" y2="6" stroke="${markerColor}" stroke-width="1" stroke-linecap="round" />`,
    `<line x1="12" y1="18" x2="12" y2="22" stroke="${markerColor}" stroke-width="1" stroke-linecap="round" />`,
    `<line x1="2" y1="12" x2="6" y2="12" stroke="${markerColor}" stroke-width="1" stroke-linecap="round" />`,
    `<line x1="18" y1="12" x2="22" y2="12" stroke="${markerColor}" stroke-width="1" stroke-linecap="round" />`,
    '</svg>'
  ].join('');
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createKarteGeocoderFeatureStyle(mapTarget) {
  if (!window.ol || !ol.style || !ol.style.Style || !ol.style.Icon) return null;
  const src = buildKarteGeocoderMarkerIcon();
  return [
    new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        src
      })
    })
  ];
}

function clearKarteGeocoderMarker() {
  if (!karteGeocoderSource || typeof karteGeocoderSource.clear !== 'function') return;
  karteGeocoderSource.clear();
}

function syncKarteLensToggleSize(mapTarget) {
  const target = mapTarget || document.getElementById('karteMap');
  if (!target || !karteLensToggleBtn) return;
  const zoomEl = target.querySelector('.ol-zoom');
  if (zoomEl) {
    const rect = zoomEl.getBoundingClientRect();
    if (rect.height) {
      const size = Math.round(rect.height);
      karteLensToggleBtn.style.setProperty('--lens-toggle-size', `${size}px`);
      target.style.setProperty('--lens-toggle-size', `${size}px`);
      const block = target.closest('.block--karte');
      if (block) {
        block.style.setProperty('--lens-toggle-size', `${size}px`);
      }
    }
  }
  syncKarteMstPosition(target);
}

function syncKarteMstPosition(mapTarget) {
  const mst = document.querySelector('.karteMstOutput');
  if (!mst) return;
  const target = mapTarget || document.getElementById('karteMap');
  if (!target) return;
  const container = mst.offsetParent || mst.closest('.block--karte') || target || document.body;
  if (!container) return;
  const containerRect = container.getBoundingClientRect();
  if (!containerRect.width) return;
  const gap = 12;
  let right = null;
  const zoomEl = target.querySelector('.ol-zoom');
  if (zoomEl) {
    const zoomRect = zoomEl.getBoundingClientRect();
    if (zoomRect.width) {
      let toggleWidth = 0;
      if (karteLensToggleBtn) {
        const toggleRect = karteLensToggleBtn.getBoundingClientRect();
        if (toggleRect.width) {
          toggleWidth = toggleRect.width;
        }
      }
      if (!toggleWidth) {
        const computed = getComputedStyle(target);
        const sizeValue = computed.getPropertyValue('--lens-toggle-size')
          || computed.getPropertyValue('--karte-lens-toggle-size');
        const parsed = parseFloat(sizeValue);
        toggleWidth = Number.isFinite(parsed) && parsed > 0 ? parsed : 44;
      }
      right = (containerRect.right - zoomRect.left) + gap + toggleWidth + gap;
    }
  }
  if (right === null && karteLensToggleBtn) {
    const toggleRect = karteLensToggleBtn.getBoundingClientRect();
    if (toggleRect.width) {
      right = (containerRect.right - toggleRect.left) + gap;
    }
  }
  if (right === null || !Number.isFinite(right)) return;
  mst.style.right = `${Math.round(right)}px`;
  mst.style.left = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
  kilometerOutput = document.getElementById('kilometerOutput');
  babOutput = document.getElementById('babOutput');
  absOutput = document.getElementById('absOutput');
  stationOutput = document.getElementById('stationOutput');
  blockOutput = document.getElementById('blockOutput');
  refOutput = document.getElementById('refOutput');
  aoaOutput = document.getElementById('aoaOutput');
  panOutput = document.getElementById('panOutput');
  utmOutput = document.getElementById('utmOutput');
  latLonOutput = document.getElementById('latLonOutput');
  scaleOutput = document.getElementById('scaleOutput');
  referenzGraphic = document.querySelector('.referenzGraphic');
  referenzOverlay = document.querySelector('.referenzOverlay');
  const copyrightYear = document.getElementById('copyrightYear');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
  initCopyHelpers();
  initTsNumberInputs();
  initStationSliders();
  initStationFocusSync();
  resetStationState();
  initKilometerFilter();
  initReferenzOverlayPlacement();
  updateReferenceOutputs();
  initKarteMap();

  fetch('obj/abs.json')
    .then(res => res.json())
    .then(data => {
      netz = data;
      autobahnen = data.autobahnen || [];
      initTomSelects();
    })
    .catch(err => {
      console.error('Fehler beim Laden von abs.json:', err);
    });
});

function initKarteMap() {
  const mapTarget = document.getElementById('karteMap');
  if (!mapTarget || !window.ol) return;

  if (window.proj4 && ol.proj && ol.proj.proj4 && typeof ol.proj.proj4.register === 'function') {
    if (!proj4.defs('EPSG:25832')) {
      proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs');
    }
    if (!proj4.defs('EPSG:25833')) {
      proj4.defs('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs');
    }
    ol.proj.proj4.register(proj4);
  }

  const projection = ol.proj.get('EPSG:25832');
  if (!projection) {
    console.warn('EPSG:25832 projection not available.');
    return;
  }


  const view = new ol.View({
    projection,
    center: [450000, 5400000],
    zoom: 10,
    minZoom: 6,
    maxZoom: 24
  });

  let mapControls = null;
  if (ol.control && typeof ol.control.defaults === 'function') {
    mapControls = ol.control.defaults();
  }

  const mapOptions = {
    target: mapTarget,
    layers: [],
    view
  };
  if (mapControls) {
    mapOptions.controls = mapControls;
  }
  if (ol.interaction && typeof ol.interaction.defaults === 'function') {
    mapOptions.interactions = ol.interaction.defaults({
      mouseWheelZoom: false,
      pinchRotate: false
    });
  }

  karteMap = new ol.Map(mapOptions);
  if (ol.interaction && typeof ol.interaction.MouseWheelZoom === 'function') {
    karteMap.addInteraction(new ol.interaction.MouseWheelZoom({ useAnchor: false }));
  }
  if (ol.control && typeof ol.control.ScaleLine === 'function') {
    if (!karteScaleControl) {
      karteScaleControl = new ol.control.ScaleLine({
        bar: true,
        text: true,
        minWidth: 96
      });
      if (karteScaleControl.element && karteScaleControl.element.classList) {
        karteScaleControl.element.classList.add('karteScaleHidden');
      }
    }
    karteMap.addControl(karteScaleControl);
  }

  initKarteSearchMode(mapTarget);
  initKarteGeocoder(mapTarget);
  initKartePinchZoomLock(mapTarget);
  initKarteLensMap(mapTarget);
  initKarteAbschnittLayer(projection);
  initKarteNetzknotenLayer(projection);
  updatePanOutput();
  updateUtmOutput();
  updateLatLonOutput();
  updateScaleOutput();
  if (view && typeof view.on === 'function') {
    view.on('change:center', () => {
      updatePanOutput();
      updateUtmOutput();
      updateLatLonOutput();
      updateScaleOutput();
    });
    view.on('change:resolution', () => {
      updateScaleOutput();
      scheduleKarteStationCenterOnZoom();
    });
  }

  const capabilitiesUrl = 'https://geoservices.bayern.de/od/wmts/geobasis/v1/1.0.0/WMTSCapabilities.xml';
  const baseLayerId = 'by_webkarte_grau';
  const aerialLayerId = 'by_dop';
  const matrixSet = 'adv_utm32';

  fetch(capabilitiesUrl)
    .then((res) => res.text())
    .then((text) => {
      const parser = new ol.format.WMTSCapabilities();
      const capabilities = parser.read(text);
      const baseOptions = ol.source.WMTS.optionsFromCapabilities(capabilities, {
        layer: baseLayerId,
        matrixSet,
        projection
      });

      if (!baseOptions) {
        throw new Error(`WMTS options not found for ${baseLayerId} / ${matrixSet}.`);
      }

      const baseSource = new ol.source.WMTS(baseOptions);
      const baseLayer = new ol.layer.Tile({
        source: baseSource,
        opacity: 0.5,
        zIndex: 4.2
      });
      karteMapBaseLayer = baseLayer;
      karteMap.addLayer(baseLayer);

      const aerialOptions = ol.source.WMTS.optionsFromCapabilities(capabilities, {
        layer: aerialLayerId,
        matrixSet,
        projection
      });
      if (aerialOptions) {
        const aerialSource = new ol.source.WMTS(aerialOptions);
        karteMapAerialLayer = new ol.layer.Tile({
          source: aerialSource,
          opacity: 1,
          zIndex: 4.3,
          visible: karteLensEnabled,
          className: 'ol-layer karteAerialLayer'
        });
        karteMap.addLayer(karteMapAerialLayer);
      }

      const tileGridExtent = baseOptions.tileGrid && baseOptions.tileGrid.getExtent
        ? baseOptions.tileGrid.getExtent()
        : null;
      const germanyExtent4326 = [5.5, 47.0, 15.5, 55.2];
      let germanyExtent = null;

      try {
        germanyExtent = ol.proj.transformExtent(
          germanyExtent4326,
          'EPSG:4326',
          projection
        );
      } catch (err) {
        console.warn('Germany extent transform failed:', err);
      }

      const extentToFit = tileGridExtent || germanyExtent;
      if (extentToFit && !karteAbschnittExtentFitted) {
        if (tileGridExtent && (!projection.getExtent || !projection.getExtent())) {
          projection.setExtent(tileGridExtent);
        }
        karteMap.getView().fit(extentToFit, {
          padding: getKarteLensFitPadding(mapTarget),
          duration: 0,
          maxZoom: 12
        });
        ensureInitialMapZoom(karteMap.getView());
      }
    })
    .catch((err) => {
      console.error('WMTS Karte konnte nicht geladen werden:', err);
    });
}

function normalizeGeoJsonCrsName(name) {
  if (typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (!trimmed) return '';

  const epsgMatch = trimmed.match(/^EPSG:(\d+)$/i);
  if (epsgMatch) return `EPSG:${epsgMatch[1]}`;

  const urnEpsgMatch = trimmed.match(/^urn:ogc:def:crs:epsg::(\d+)$/i);
  if (urnEpsgMatch) return `EPSG:${urnEpsgMatch[1]}`;

  const httpEpsgMatch = trimmed.match(/\/EPSG\/\d+\/(\d+)$/i);
  if (httpEpsgMatch) return `EPSG:${httpEpsgMatch[1]}`;

  if (/CRS84$/i.test(trimmed)) return 'EPSG:4326';
  return '';
}

function getFirstGeoJsonCoordinate(coordinates) {
  if (!Array.isArray(coordinates) || !coordinates.length) return null;
  if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    return coordinates;
  }
  return getFirstGeoJsonCoordinate(coordinates[0]);
}

function resolveGeoJsonDataProjection(data) {
  const fallback = 'EPSG:4326';
  if (!data || typeof data !== 'object') return fallback;

  const crsName = normalizeGeoJsonCrsName(
    data?.crs?.properties?.name || data?.crs?.name
  );
  if (crsName) return crsName;

  if (!Array.isArray(data.features) || !data.features.length) return fallback;
  for (const feature of data.features) {
    const coordinate = getFirstGeoJsonCoordinate(feature?.geometry?.coordinates);
    if (!coordinate) continue;
    const x = Number(coordinate[0]);
    const y = Number(coordinate[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const looksLikeLonLat = Math.abs(x) <= 180 && Math.abs(y) <= 90;
    return looksLikeLonLat ? 'EPSG:4326' : 'EPSG:25832';
  }

  return fallback;
}

function getTextMeasureContext() {
  if (netzknotenMeasureContext) return netzknotenMeasureContext;
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return null;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  netzknotenMeasureContext = ctx;
  return netzknotenMeasureContext;
}

function measureTextWidth(text, font) {
  const value = text === undefined || text === null ? '' : String(text);
  if (!value) return 0;
  const ctx = getTextMeasureContext();
  if (!ctx) {
    return Math.ceil(value.length * 7);
  }
  ctx.font = font;
  return Math.ceil(ctx.measureText(value).width);
}

function getFontSizeFromFontString(font) {
  const match = String(font || '').match(/(\d+(?:\.\d+)?)px/);
  if (!match) return 12;
  const size = Number.parseFloat(match[1]);
  return Number.isFinite(size) && size > 0 ? size : 12;
}

function getTextMetrics(font) {
  const key = String(font || '');
  if (netzknotenTextMetricsCache.has(key)) {
    return netzknotenTextMetricsCache.get(key);
  }

  const fallbackSize = getFontSizeFromFontString(font);
  const fallbackMetrics = {
    ascent: fallbackSize * 0.78,
    descent: fallbackSize * 0.22
  };

  const ctx = getTextMeasureContext();
  if (!ctx) {
    netzknotenTextMetricsCache.set(key, fallbackMetrics);
    return fallbackMetrics;
  }

  ctx.font = font;
  const measure = ctx.measureText(NETZKNOTEN_METRICS_SAMPLE);
  const ascent = Number(measure.actualBoundingBoxAscent);
  const descent = Number(measure.actualBoundingBoxDescent);
  const metrics = (Number.isFinite(ascent) && ascent > 0 && Number.isFinite(descent) && descent >= 0)
    ? { ascent, descent }
    : fallbackMetrics;
  netzknotenTextMetricsCache.set(key, metrics);
  return metrics;
}

function measureTextMetrics(text, font) {
  const value = text === undefined || text === null ? '' : String(text);
  const fallback = getTextMetrics(font);
  const fallbackWidth = measureTextWidth(value, font);
  const fallbackPayload = {
    ascent: fallback.ascent,
    descent: fallback.descent,
    left: 0,
    right: fallbackWidth,
    width: fallbackWidth
  };
  const ctx = getTextMeasureContext();
  if (!ctx || !value) return fallbackPayload;
  ctx.font = font;
  const measure = ctx.measureText(value);
  const ascent = Number(measure.actualBoundingBoxAscent);
  const descent = Number(measure.actualBoundingBoxDescent);
  const left = Number(measure.actualBoundingBoxLeft);
  const right = Number(measure.actualBoundingBoxRight);
  const width = Number(measure.width);
  return {
    ascent: (Number.isFinite(ascent) && ascent > 0) ? ascent : fallback.ascent,
    descent: (Number.isFinite(descent) && descent >= 0) ? descent : fallback.descent,
    left: (Number.isFinite(left) && left >= 0) ? left : 0,
    right: (Number.isFinite(right) && right >= 0) ? right : fallbackWidth,
    width: (Number.isFinite(width) && width >= 0) ? width : fallbackWidth
  };
}

function escapeSvgText(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncateNetzknotenLabel(text, maxChars) {
  const limit = Number.isFinite(maxChars) ? Math.max(1, Math.floor(maxChars)) : 0;
  if (!limit) return text;
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 3).trimEnd()}...`;
}

function normalizeNetzknotenKtValue(value) {
  if (value === undefined || value === null) return '';
  const text = String(value).trim();
  if (!text || text === '-') return '';
  return text;
}

function normalizeNetzknotenAsParts(value) {
  const raw = value === undefined || value === null ? '' : String(value).replace(/\s+/g, ' ').trim();
  if (!raw || raw === '-') {
    return { type: '', text: '' };
  }
  const match = raw.match(/^(AS|AK|AD)\s+(.+)$/i);
  if (!match) {
    return { type: '', text: truncateNetzknotenLabel(raw, NETZKNOTEN_SIGN_MAX_AS_CHARS) };
  }
  const type = match[1].toUpperCase();
  const rest = match[2].trim();
  let labelText = rest;
  if (type === 'AK') {
    labelText = `Kreuz ${rest}`;
  }
  return {
    type,
    text: truncateNetzknotenLabel(labelText || raw, NETZKNOTEN_SIGN_MAX_AS_CHARS)
  };
}

function normalizeBabDisplayText(value) {
  const source = String(value || '').trim();
  if (!source) return '';
  const match = source.match(/(\d+)/);
  if (match) return match[1];
  return source.replace(/^A\s*/i, '');
}

function getNetzknotenTypeIconKind(type) {
  const normalized = String(type || '').trim().toUpperCase();
  if (normalized === 'AS') return 'as';
  if (normalized === 'AK' || normalized === 'AD') return 'ak';
  return '';
}

function parseNetzknotenClipPathCoordinate(value, base) {
  const text = String(value || '').trim();
  if (!text) return null;
  if (text.endsWith('%')) {
    const percent = Number.parseFloat(text.slice(0, -1));
    if (!Number.isFinite(percent)) return null;
    return (percent / 100) * base;
  }
  const numeric = Number.parseFloat(text);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseNetzknotenClipPathPolygon(clipPathValue, width, height) {
  const text = String(clipPathValue || '').trim();
  const match = text.match(/^polygon\s*\((.+)\)$/i);
  if (!match) return null;
  const pairs = match[1].split(',');
  const points = [];
  pairs.forEach((pair) => {
    const parts = pair.trim().split(/\s+/);
    if (parts.length < 2) return;
    const x = parseNetzknotenClipPathCoordinate(parts[0], width);
    const y = parseNetzknotenClipPathCoordinate(parts[1], height);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    points.push([x, y]);
  });
  return points.length >= 3 ? points : null;
}

function getNetzknotenSelectorIconData(kind) {
  if (netzknotenSelectorIconCache.has(kind)) {
    return netzknotenSelectorIconCache.get(kind);
  }
  if (typeof document === 'undefined' || typeof window === 'undefined' || !document.body) {
    netzknotenSelectorIconCache.set(kind, null);
    return null;
  }
  const className = kind === 'as' ? 'asIcon' : kind === 'ak' ? 'akIcon' : '';
  if (!className) {
    netzknotenSelectorIconCache.set(kind, null);
    return null;
  }

  const probe = document.createElement('div');
  probe.className = className;
  probe.setAttribute('aria-hidden', 'true');
  probe.style.position = 'absolute';
  probe.style.left = '-9999px';
  probe.style.top = '-9999px';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  document.body.appendChild(probe);

  const computed = window.getComputedStyle(probe);
  const clipPathValue = computed.getPropertyValue('clip-path')
    || computed.getPropertyValue('-webkit-clip-path')
    || computed.clipPath
    || '';
  const width = Number.parseFloat(computed.width) || NETZKNOTEN_ICON_FALLBACK_WIDTH;
  const height = Number.parseFloat(computed.height) || NETZKNOTEN_ICON_FALLBACK_HEIGHT;
  document.body.removeChild(probe);

  const points = parseNetzknotenClipPathPolygon(clipPathValue, width, height);
  const iconData = points ? { points, width, height } : null;
  netzknotenSelectorIconCache.set(kind, iconData);
  return iconData;
}

function renderNetzknotenTypeIcon(iconData, x, y, targetWidth, targetHeight) {
  if (!iconData || !Array.isArray(iconData.points) || !iconData.points.length) {
    return '';
  }
  const sx = targetWidth / iconData.width;
  const sy = targetHeight / iconData.height;
  const pointsText = iconData.points
    .map(([px, py]) => `${(x + (px * sx)).toFixed(3)} ${(y + (py * sy)).toFixed(3)}`)
    .join(' ');
  return `<polygon points="${pointsText}" fill="#ffffff" />`;
}

function createNetzknotenSignSvg({ asText, ktText, type }) {
  const signBlue = '#005a8c';
  const signNoIconBg = '#e9f5ff';
  const signNoIconText = '#627d98';
  const white = '#ffffff';
  const hasType = !!type;
  const typeIconKind = getNetzknotenTypeIconKind(type);
  const typeIconData = typeIconKind ? getNetzknotenSelectorIconData(typeIconKind) : null;
  const hasTypeIcon = !!typeIconData;
  const hasTypeTextBadge = hasType && !hasTypeIcon;
  const useNoIconVariant = !hasType;
  const hasKt = !!ktText && !useNoIconVariant;
  const signBackground = useNoIconVariant ? signNoIconBg : signBlue;
  const bodyTextColor = useNoIconVariant ? signNoIconText : white;

  const bodyFont = "11px 'ddin-expandedbold', sans-serif";
  const badgeFont = "9px 'ddin-bold', 'roboto-bold', sans-serif";
  const pillFont = "10px 'ddin-regular', sans-serif";
  const bodyMetrics = getTextMetrics(bodyFont);
  const pillBaseMetrics = getTextMetrics(pillFont);
  const pillMetrics = hasKt
    ? measureTextMetrics(ktText, pillFont)
    : {
      ascent: pillBaseMetrics.ascent,
      descent: pillBaseMetrics.descent,
      left: 0,
      right: 0,
      width: 0
    };
  const bodyWidth = Math.max(16, measureTextWidth(asText, bodyFont));
  const typeHeight = hasTypeIcon ? NETZKNOTEN_ICON_TARGET_HEIGHT : 12;
  const typeWidth = hasTypeIcon
    ? Math.max(9, Math.round((typeIconData.width / typeIconData.height) * typeHeight))
    : hasTypeTextBadge
      ? Math.max(18, measureTextWidth(type, badgeFont) + 8)
      : 0;
  const ktTextVisualWidth = Math.max(0, pillMetrics.left + pillMetrics.right);
  const ktWidth = hasKt
    ? Math.max(14, Math.ceil(ktTextVisualWidth + (NETZKNOTEN_KT_PILL_PADDING_X * 2)))
    : 0;

  const spacing = 4;
  const contentPadX = NETZKNOTEN_SIGN_CONTENT_PAD_X;
  const contentPadY = NETZKNOTEN_SIGN_CONTENT_PAD_Y;
  let x = contentPadX;
  const partsWidth = [];
  if (typeWidth) partsWidth.push(typeWidth);
  if (ktWidth) partsWidth.push(ktWidth);
  partsWidth.push(bodyWidth);
  const contentWidth = partsWidth.reduce((sum, width, idx) => sum + width + (idx > 0 ? spacing : 0), 0);
  const ktTextHeight = pillMetrics.ascent + pillMetrics.descent;
  const ktHeight = Math.max(
    NETZKNOTEN_KT_PILL_MIN_HEIGHT,
    Math.ceil(ktTextHeight + (NETZKNOTEN_KT_PILL_PADDING_Y * 2))
  );
  const bodyTextHeight = bodyMetrics.ascent + bodyMetrics.descent;
  const contentHeight = Math.max(typeHeight, ktHeight, bodyTextHeight);
  const width = Math.max(NETZKNOTEN_SIGN_MIN_WIDTH, Math.ceil(contentWidth + (contentPadX * 2)));
  const height = Math.max(NETZKNOTEN_SIGN_MIN_HEIGHT, Math.ceil(contentHeight + (contentPadY * 2)));
  const centerY = height / 2;
  const typeY = centerY + 0.2;
  const typeYPos = Math.round((height - typeHeight) / 2);
  const ktYPos = Math.round((height - ktHeight) / 2);
  const ktBaselineOffset = ((ktHeight - ktTextHeight) / 2) + pillMetrics.ascent;
  const sharedBaselineY = hasKt
    ? (ktYPos + ktBaselineOffset)
    : (centerY + ((bodyMetrics.ascent - bodyMetrics.descent) / 2));
  const ktY = sharedBaselineY;
  const bodyY = sharedBaselineY;
  const bodyStartX = [];

  if (typeWidth) {
    bodyStartX.push({ kind: 'type', x, width: typeWidth });
    x += typeWidth + spacing;
  }
  if (ktWidth) {
    bodyStartX.push({ kind: 'kt', x, width: ktWidth });
    x += ktWidth + spacing;
  }
  bodyStartX.push({ kind: 'body', x, width: bodyWidth });

  const typePart = bodyStartX.find(part => part.kind === 'type');
  const ktPart = bodyStartX.find(part => part.kind === 'kt');
  const bodyPart = bodyStartX.find(part => part.kind === 'body');

  const typeBadge = (typePart && hasTypeTextBadge)
    ? `
    <rect x="${typePart.x}" y="${typeYPos}" width="${typePart.width}" height="${typeHeight}" rx="3" fill="${white}" />
    <text x="${typePart.x + (typePart.width / 2)}" y="${typeY}" text-anchor="middle" dominant-baseline="middle"
      font-family="'ddin-bold','roboto-bold',sans-serif" font-size="9" fill="${signBlue}">${escapeSvgText(type)}</text>`
    : '';
  const typeIcon = (typePart && hasTypeIcon)
    ? renderNetzknotenTypeIcon(typeIconData, typePart.x, typeYPos, typeWidth, typeHeight)
    : '';

  const ktBadge = ktPart
    ? (() => {
      const ktCenterX = ktPart.x + (ktPart.width / 2);
      return `
    <rect x="${ktPart.x}" y="${ktYPos}" width="${ktPart.width}" height="${ktHeight}" rx="${Math.round(ktHeight / 2)}" fill="none" stroke="${white}" stroke-width="1.2" />
    <text x="${ktCenterX}" y="${ktY}" text-anchor="middle"
      font-family="'ddin-regular','roboto-regular',sans-serif" font-size="10" fill="${white}">${escapeSvgText(ktText)}</text>`;
    })()
    : '';

  const bodyText = bodyPart
    ? `
    <text x="${bodyPart.x}" y="${bodyY}" text-anchor="start"
      font-family="'ddin-expandedbold',sans-serif" font-size="11" fill="${bodyTextColor}">${escapeSvgText(asText)}</text>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="6" fill="${signBackground}" stroke="${signBlue}" stroke-width="1" />
    <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="5" fill="none" stroke="${white}" stroke-width="2" />
    ${typeBadge}
    ${typeIcon}
    ${ktBadge}
    ${bodyText}
  </svg>`;
  return { svg, width, height };
}

function createNetzknotenCompactBabSignSvg({ babText, ktText }) {
  const signBlue = '#005a8c';
  const white = '#ffffff';
  const compactBabText = normalizeBabDisplayText(babText);
  const compactKtText = normalizeNetzknotenKtValue(ktText);
  const babFont = "10px 'roboto-bold', sans-serif";
  const ktFont = "10px 'ddin-regular', sans-serif";
  const babTextMetrics = measureTextMetrics(compactBabText, babFont);
  const babTextWidth = Math.max(0, babTextMetrics.left + babTextMetrics.right);
  const innerWidth = Math.max(28, Math.ceil(babTextWidth + 10));
  const innerHeight = 19;
  const outerPadX = 2;
  const outerPadY = 2;
  const gap = compactKtText ? 4 : 0;
  const ktTextMetrics = compactKtText ? measureTextMetrics(compactKtText, ktFont) : null;
  const ktTextWidth = ktTextMetrics ? Math.max(0, ktTextMetrics.left + ktTextMetrics.right) : 0;
  const ktPillHeight = compactKtText ? 15 : 0;
  const ktPillWidth = compactKtText ? Math.max(16, Math.ceil(ktTextWidth + 10)) : 0;
  const contentWidth = innerWidth + gap + ktPillWidth;
  const contentHeight = Math.max(innerHeight, ktPillHeight);
  const width = contentWidth + (outerPadX * 2);
  const height = contentHeight + (outerPadY * 2);
  const innerX = outerPadX;
  const innerY = outerPadY + Math.round((contentHeight - innerHeight) / 2);
  const baselineY = innerY + ((innerHeight - (babTextMetrics.ascent + babTextMetrics.descent)) / 2) + babTextMetrics.ascent;
  const textX = innerX + (innerWidth / 2);
  const shieldScaleX = innerWidth / 100;
  const shieldScaleY = innerHeight / 100;
  const ktPillX = innerX + innerWidth + gap;
  const ktPillY = outerPadY + Math.round((contentHeight - ktPillHeight) / 2);
  const ktTextX = ktPillX + (ktPillWidth / 2);
  const ktTextY = ktTextMetrics
    ? ktPillY + ((ktPillHeight - (ktTextMetrics.ascent + ktTextMetrics.descent)) / 2) + ktTextMetrics.ascent
    : 0;
  const ktPillRadius = Math.round(ktPillHeight / 2);
  const ktPillSvg = compactKtText
    ? `
    <rect x="${ktPillX + 0.5}" y="${ktPillY + 0.5}" width="${ktPillWidth - 1}" height="${ktPillHeight - 1}" rx="${ktPillRadius}" fill="${signBlue}" stroke="${white}" stroke-width="1" />
    <text x="${ktTextX}" y="${ktTextY}" text-anchor="middle"
      font-family="'ddin-regular',sans-serif" font-size="10" fill="${white}">${escapeSvgText(compactKtText)}</text>`
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="4" fill="${white}" stroke="${signBlue}" stroke-width="1" />
    <polygon points="${BAB_SIGN_SHIELD_POLYGON_POINTS}" fill="${signBlue}" transform="translate(${innerX} ${innerY}) scale(${shieldScaleX} ${shieldScaleY})" />
    <text x="${textX}" y="${baselineY}" text-anchor="middle"
      font-family="'roboto-bold',sans-serif" font-size="10" fill="${white}">${escapeSvgText(compactBabText)}</text>
    ${ktPillSvg}
  </svg>`;
  return { svg, width, height };
}

function shouldShowNetzknotenLabel(resolution) {
  const view = karteMap && typeof karteMap.getView === 'function' ? karteMap.getView() : null;
  const zoom = view && typeof view.getZoom === 'function' ? view.getZoom() : null;
  if (Number.isFinite(zoom) && zoom < NETZKNOTEN_LABEL_MIN_ZOOM) return false;
  return Number.isFinite(resolution) && resolution > 0;
}

function shouldUseCompactNetzknotenLabel(zoom) {
  return Number.isFinite(zoom) && zoom < NETZKNOTEN_FULL_LABEL_MIN_ZOOM;
}

function getNetzknotenLabelCandidates() {
  const gap = NETZKNOTEN_LABEL_POINT_GAP_PX;
  return [
    { anchorX: 0, anchorY: 1, dx: gap, dy: gap, index: 0 },
    { anchorX: 1, anchorY: 1, dx: -gap, dy: gap, index: 1 },
    { anchorX: 0, anchorY: 0, dx: gap, dy: -gap, index: 2 },
    { anchorX: 1, anchorY: 0, dx: -gap, dy: -gap, index: 3 }
  ];
}

function getNetzknotenOppositeCornerIndex(index) {
  const map = {
    0: 3,
    1: 2,
    2: 1,
    3: 0
  };
  return Object.prototype.hasOwnProperty.call(map, index) ? map[index] : null;
}

function getNetzknotenStackIndex(feature) {
  if (!feature || typeof feature.get !== 'function') return 0;
  const value = Number(feature.get('__nkStackIndex'));
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function getNetzknotenStackSize(feature) {
  if (!feature || typeof feature.get !== 'function') return 1;
  const value = Number(feature.get('__nkStackSize'));
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1;
}

function getNetzknotenCoordinateKey(feature) {
  if (!feature || typeof feature.getGeometry !== 'function') return '';
  const geometry = feature.getGeometry();
  if (!geometry || typeof geometry.getCoordinates !== 'function') return '';
  const coords = geometry.getCoordinates();
  if (!Array.isArray(coords) || coords.length < 2) return '';
  const x = Number(coords[0]);
  const y = Number(coords[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return '';
  return `${x.toFixed(3)}|${y.toFixed(3)}`;
}

function getNetzknotenBabKey(feature) {
  if (!feature || typeof feature.get !== 'function') return '';
  return String(feature.get('bab') || '').trim();
}

function assignNetzknotenStackMetadata(features) {
  if (!Array.isArray(features) || !features.length) return;
  const groups = new Map();
  features.forEach((feature) => {
    const key = getNetzknotenCoordinateKey(feature);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(feature);
  });

  groups.forEach((group) => {
    if (!Array.isArray(group) || !group.length) return;
    group.sort((a, b) => {
      const nkA = a && typeof a.get === 'function' ? String(a.get('nk') || '') : '';
      const nkB = b && typeof b.get === 'function' ? String(b.get('nk') || '') : '';
      if (nkA !== nkB) return nkA.localeCompare(nkB, 'de');
      const ktA = a && typeof a.get === 'function' ? String(a.get('kt') || '') : '';
      const ktB = b && typeof b.get === 'function' ? String(b.get('kt') || '') : '';
      if (ktA !== ktB) return ktA.localeCompare(ktB, 'de');
      const asA = a && typeof a.get === 'function' ? String(a.get('as') || '') : '';
      const asB = b && typeof b.get === 'function' ? String(b.get('as') || '') : '';
      return asA.localeCompare(asB, 'de');
    });
    const size = group.length;
    group.forEach((feature, index) => {
      if (!feature || typeof feature.set !== 'function') return;
      feature.set('__nkStackIndex', index, true);
      feature.set('__nkStackSize', size, true);
    });
  });
}

function getNetzknotenLabelExtent(point, candidate, widthPx, heightPx, resolution) {
  const topLeftPxX = candidate.dx - (candidate.anchorX * widthPx);
  const topLeftPxY = -candidate.dy - (candidate.anchorY * heightPx);

  const minX = point[0] + (topLeftPxX * resolution);
  const maxX = minX + (widthPx * resolution);
  const maxY = point[1] - (topLeftPxY * resolution);
  const minY = maxY - (heightPx * resolution);
  return [minX, minY, maxX, maxY];
}

function getNearbyAbschnittFeaturesForNetzknotenPoint(point, widthPx, heightPx, resolution) {
  if (!Array.isArray(point) || point.length < 2) return [];
  const nearbyFeatures = [];
  if (karteAbschnittSource && typeof karteAbschnittSource.forEachFeatureInExtent === 'function') {
    const searchRadiusMap = (Math.max(widthPx, heightPx) + NETZKNOTEN_LABEL_SEARCH_PADDING_PX) * resolution;
    const searchExtent = [
      point[0] - searchRadiusMap,
      point[1] - searchRadiusMap,
      point[0] + searchRadiusMap,
      point[1] + searchRadiusMap
    ];
    karteAbschnittSource.forEachFeatureInExtent(searchExtent, (absFeature) => {
      nearbyFeatures.push(absFeature);
    });
  }
  if (!nearbyFeatures.length && Array.isArray(karteAbschnittFeatures) && karteAbschnittFeatures.length) {
    nearbyFeatures.push(...karteAbschnittFeatures);
  }
  return nearbyFeatures;
}

function scoreNetzknotenLabelCandidate(point, candidate, widthPx, heightPx, resolution, nearbyFeatures) {
  const extent = getNetzknotenLabelExtent(point, candidate, widthPx, heightPx, resolution);
  const center = [
    (extent[0] + extent[2]) / 2,
    (extent[1] + extent[3]) / 2
  ];
  let intersections = 0;
  let minDistanceSq = Infinity;

  nearbyFeatures.forEach((absFeature) => {
    const absGeometry = absFeature && typeof absFeature.getGeometry === 'function'
      ? absFeature.getGeometry()
      : null;
    if (!absGeometry) return;
    if (typeof absGeometry.intersectsExtent === 'function' && absGeometry.intersectsExtent(extent)) {
      intersections += 1;
    }
    const closest = getClosestPointOnGeometry(absGeometry, center);
    if (!closest || !Number.isFinite(closest.distanceSq)) return;
    if (closest.distanceSq < minDistanceSq) {
      minDistanceSq = closest.distanceSq;
    }
  });

  const distanceSq = (candidate.dx * candidate.dx) + (candidate.dy * candidate.dy);
  return {
    anchorX: candidate.anchorX,
    anchorY: candidate.anchorY,
    dx: candidate.dx,
    dy: candidate.dy,
    index: candidate.index,
    intersections,
    minDistanceSq,
    distanceSq
  };
}

function getNetzknotenPreferredCornerIndex(feature, widthPx, heightPx, resolution, zoomBucket) {
  const babKey = getNetzknotenBabKey(feature);
  if (!babKey || !Array.isArray(karteNetzknotenFeatures) || !karteNetzknotenFeatures.length) return null;
  const cacheKey = `${babKey}|${karteAbschnittGeometryRevision}`;
  if (netzknotenBabCornerCache.has(cacheKey)) {
    return netzknotenBabCornerCache.get(cacheKey);
  }

  const candidates = getNetzknotenLabelCandidates();
  const aggregateScores = candidates.map(candidate => ({
    index: candidate.index,
    intersections: 0,
    minDistanceSq: 0,
    distanceSq: (candidate.dx * candidate.dx) + (candidate.dy * candidate.dy),
    samples: 0
  }));

  karteNetzknotenFeatures.forEach((babFeature) => {
    if (getNetzknotenBabKey(babFeature) !== babKey) return;
    const geometry = babFeature && typeof babFeature.getGeometry === 'function' ? babFeature.getGeometry() : null;
    const point = geometry && typeof geometry.getCoordinates === 'function' ? geometry.getCoordinates() : null;
    if (!Array.isArray(point) || point.length < 2) return;
    const nearbyFeatures = getNearbyAbschnittFeaturesForNetzknotenPoint(point, widthPx, heightPx, resolution);
    if (!nearbyFeatures.length) return;
    candidates.forEach((candidate, index) => {
      const score = scoreNetzknotenLabelCandidate(point, candidate, widthPx, heightPx, resolution, nearbyFeatures);
      aggregateScores[index].intersections += score.intersections;
      aggregateScores[index].minDistanceSq += Number.isFinite(score.minDistanceSq) ? score.minDistanceSq : 0;
      aggregateScores[index].samples += 1;
    });
  });

  const viableScores = aggregateScores.filter(score => score.samples > 0);
  if (!viableScores.length) {
    netzknotenBabCornerCache.set(cacheKey, null);
    return null;
  }

  viableScores.sort((a, b) => {
    if (a.intersections !== b.intersections) return a.intersections - b.intersections;
    if (a.minDistanceSq !== b.minDistanceSq) return b.minDistanceSq - a.minDistanceSq;
    if (a.distanceSq !== b.distanceSq) return a.distanceSq - b.distanceSq;
    return a.index - b.index;
  });

  const selectedIndex = viableScores[0].index;
  netzknotenBabCornerCache.set(cacheKey, selectedIndex);
  return selectedIndex;
}

function chooseNetzknotenLabelPlacement(feature, widthPx, heightPx, resolution, zoomBucket) {
  const fallback = {
    anchorX: NETZKNOTEN_LABEL_FALLBACK_ANCHOR_X,
    anchorY: NETZKNOTEN_LABEL_FALLBACK_ANCHOR_Y,
    dx: NETZKNOTEN_LABEL_POINT_GAP_PX,
    dy: NETZKNOTEN_LABEL_POINT_GAP_PX
  };
  if (!feature || !Number.isFinite(widthPx) || !Number.isFinite(heightPx) || !Number.isFinite(resolution)) {
    return fallback;
  }

  const geometry = typeof feature.getGeometry === 'function' ? feature.getGeometry() : null;
  const point = geometry && typeof geometry.getCoordinates === 'function' ? geometry.getCoordinates() : null;
  if (!Array.isArray(point) || point.length < 2) return fallback;

  const nearbyFeatures = getNearbyAbschnittFeaturesForNetzknotenPoint(point, widthPx, heightPx, resolution);
  if (!nearbyFeatures.length) return fallback;

  const stackIndex = getNetzknotenStackIndex(feature);
  const stackSize = getNetzknotenStackSize(feature);
  const candidates = getNetzknotenLabelCandidates();
  const scoredCandidates = candidates.map(candidate => (
    scoreNetzknotenLabelCandidate(point, candidate, widthPx, heightPx, resolution, nearbyFeatures)
  ));

  if (!scoredCandidates.length) return fallback;
  scoredCandidates.sort((a, b) => {
    if (a.intersections !== b.intersections) return a.intersections - b.intersections;
    if (a.minDistanceSq !== b.minDistanceSq) return b.minDistanceSq - a.minDistanceSq;
    if (a.distanceSq !== b.distanceSq) return a.distanceSq - b.distanceSq;
    return a.index - b.index;
  });

  const preferredCornerIndex = getNetzknotenPreferredCornerIndex(feature, widthPx, heightPx, resolution, zoomBucket);
  const primary = preferredCornerIndex !== null
    ? (scoredCandidates.find(candidate => candidate.index === preferredCornerIndex) || scoredCandidates[0])
    : scoredCandidates[0];
  let selected = primary;
  if (stackSize === 2 && stackIndex === 1) {
    const oppositeIndex = getNetzknotenOppositeCornerIndex(primary ? primary.index : null);
    const opposite = scoredCandidates.find(candidate => candidate.index === oppositeIndex);
    const fallbackSecond = scoredCandidates.find(candidate => candidate.index !== primary.index) || primary;
    if (opposite && primary) {
      const extraIntersections = opposite.intersections - primary.intersections;
      selected = extraIntersections <= 1 ? opposite : fallbackSecond;
    } else {
      selected = fallbackSecond;
    }
  } else if (stackSize > 1 && stackIndex > 0) {
    const oppositeIndex = getNetzknotenOppositeCornerIndex(primary ? primary.index : null);
    const orderedCorners = [];
    if (primary) orderedCorners.push(primary);
    if (oppositeIndex !== null) {
      const opposite = scoredCandidates.find(candidate => candidate.index === oppositeIndex);
      if (opposite) orderedCorners.push(opposite);
    }
    scoredCandidates.forEach((candidate) => {
      if (!orderedCorners.some(entry => entry.index === candidate.index)) {
        orderedCorners.push(candidate);
      }
    });
    selected = orderedCorners[stackIndex % orderedCorners.length] || primary;
  }
  if (!selected) return fallback;

  const ringStep = stackSize > 1 && stackIndex > 0 ? stackIndex * 4 : 0;
  const dx = selected.dx === 0
    ? 0
    : selected.dx + (Math.sign(selected.dx) * ringStep);
  const dy = selected.dy === 0
    ? 0
    : selected.dy + (Math.sign(selected.dy) * ringStep);

  return {
    anchorX: selected.anchorX,
    anchorY: selected.anchorY,
    dx,
    dy
  };
}

function getNetzknotenLabelPlacement(feature, widthPx, heightPx, resolution, zoomBucket) {
  const fallback = {
    anchorX: NETZKNOTEN_LABEL_FALLBACK_ANCHOR_X,
    anchorY: NETZKNOTEN_LABEL_FALLBACK_ANCHOR_Y,
    dx: NETZKNOTEN_LABEL_POINT_GAP_PX,
    dy: NETZKNOTEN_LABEL_POINT_GAP_PX
  };
  if (!feature || typeof feature.get !== 'function') return fallback;
  const sizeKey = `${Math.round(widthPx)}x${Math.round(heightPx)}`;
  const cache = feature.get('__nkLabelPlacement');
  if (cache
    && cache.rev === karteAbschnittGeometryRevision
    && cache.zoom === zoomBucket
    && cache.sizeKey === sizeKey
    && Number.isFinite(cache.anchorX)
    && Number.isFinite(cache.anchorY)
    && Number.isFinite(cache.dx)
    && Number.isFinite(cache.dy)) {
    return {
      anchorX: cache.anchorX,
      anchorY: cache.anchorY,
      dx: cache.dx,
      dy: cache.dy
    };
  }

  const placement = chooseNetzknotenLabelPlacement(feature, widthPx, heightPx, resolution, zoomBucket);
  const normalized = {
    anchorX: Number.isFinite(placement.anchorX) ? placement.anchorX : fallback.anchorX,
    anchorY: Number.isFinite(placement.anchorY) ? placement.anchorY : fallback.anchorY,
    dx: Number.isFinite(placement.dx) ? Math.round(placement.dx * 10) / 10 : fallback.dx,
    dy: Number.isFinite(placement.dy) ? Math.round(placement.dy * 10) / 10 : fallback.dy
  };
  feature.set('__nkLabelPlacement', {
    rev: karteAbschnittGeometryRevision,
    zoom: zoomBucket,
    sizeKey,
    anchorX: normalized.anchorX,
    anchorY: normalized.anchorY,
    dx: normalized.dx,
    dy: normalized.dy
  }, true);
  return normalized;
}

function refreshNetzknotenLabelDisplacements() {
  if (!Array.isArray(karteNetzknotenFeatures) || !karteNetzknotenFeatures.length) return;
  if (!Array.isArray(karteAbschnittFeatures) || !karteAbschnittFeatures.length) return;
  netzknotenBabCornerCache = new Map();

  karteNetzknotenFeatures.forEach((feature) => {
    if (!feature) return;
    if (typeof feature.unset === 'function') {
      feature.unset('__nkLabelPlacement', true);
    }
  });

  if (karteNetzknotenLayer && typeof karteNetzknotenLayer.changed === 'function') {
    karteNetzknotenLayer.changed();
  }
}

function initKarteSearchMode(mapTarget) {
  if (!karteMap || !mapTarget) return;
  if (mapTarget.querySelector('.karteSearchToggle')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'karteSearchToggle';
  button.textContent = 'Fangmodus';
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('title', 'Fangmodus');

  const crosshair = document.createElement('div');
  crosshair.className = 'karteSearchCrosshair';
  crosshair.setAttribute('aria-hidden', 'true');
  crosshair.innerHTML = `
    <div class="karteSnapFrame">
      <div class="karteSnapCorner karteSnapCorner--ul"></div>
      <div class="karteSnapCorner karteSnapCorner--ur"></div>
      <div class="karteSnapCorner karteSnapCorner--ll"></div>
      <div class="karteSnapCorner karteSnapCorner--lr"></div>
      <div class="karteSnapBar">
        <span class="karteSnapBarLabel"></span>
      </div>
    </div>
    <div class="karteCrossCenter">
      <div class="karteCrossDot"></div>
    </div>
  `;

  mapTarget.appendChild(button);
  mapTarget.appendChild(crosshair);

  karteSearchButton = button;
  karteSearchCrosshair = crosshair;
  karteSearchFrame = crosshair.querySelector('.karteSnapFrame');
  karteSearchDot = crosshair.querySelector('.karteCrossDot');
  karteSearchBar = crosshair.querySelector('.karteSnapBar');
  karteSearchBarLabel = crosshair.querySelector('.karteSnapBarLabel');
  karteSearchCorners = Array.from(crosshair.querySelectorAll('.karteSnapCorner'));

  button.addEventListener('click', () => {
    setKarteSearchActive(!karteSearchActive, mapTarget);
  });

  setKarteSearchActive(false, mapTarget);

  karteMap.on('pointerdrag', () => {
    if (!karteSearchActive) return;
    karteSearchDragging = true;
    karteSearchHasUserInteraction = true;
    scheduleKarteSearchDotUpdate();
    scheduleKarteSearchBarUpdate();
  });

  karteMap.on('move', () => {
    if (karteSearchActive) {
      scheduleKarteSearchDotUpdate();
    }
    scheduleKarteSearchBarUpdate();
  });

  karteMap.on('moveend', () => {
    const shouldHandleGeocoder = karteSearchGeocoderPending;
    if (!karteSearchActive && !shouldHandleGeocoder) return;
    if (!karteSearchDragging && !shouldHandleGeocoder) return;
    karteSearchDragging = false;
    karteSearchGeocoderPending = false;
    if (karteSearchActive) {
      scheduleKarteSearchDotUpdate();
      scheduleKarteSearchBarUpdate();
    }
    if (shouldHandleGeocoder) {
      handleKarteSearchGeocoderJump();
      return;
    }
    handleKarteSearchMoveEnd();
  });

  const view = karteMap.getView ? karteMap.getView() : null;
  if (view && typeof view.on === 'function') {
    view.on('change:center', () => {
      if (!karteSearchActive) return;
      if (!karteSearchSnapping && !karteSearchDragging) return;
      updateKarteSearchDot();
    });
    view.on('change:resolution', () => {
      scheduleKarteSearchBarUpdate();
    });
  }
}

function initKarteGeocoder(mapTarget) {
  if (!karteMap || !mapTarget) return;
  if (karteGeocoder) return;
  if (typeof Geocoder !== 'function') return;

  const direktsucheTarget = document.getElementById('direktsucheTools');
  const wrap = document.createElement('div');
  wrap.className = 'karteGeocoderWrap';
  wrap.setAttribute('aria-hidden', 'false');
  if (direktsucheTarget) {
    direktsucheTarget.appendChild(wrap);
  } else {
    mapTarget.appendChild(wrap);
  }

  const featureStyle = createKarteGeocoderFeatureStyle(mapTarget);
  const geocoder = new Geocoder('nominatim', {
    provider: createBayernGeocoderProvider(),
    lang: 'de-DE',
    placeholder: 'Adresse suchen',
    targetType: 'text-input',
    keepOpen: true,
    limit: 6,
    target: wrap,
    featureStyle: featureStyle || undefined
  });

  karteGeocoder = geocoder;
  karteGeocoderWrap = wrap;
  karteMap.addControl(geocoder);
  if (typeof geocoder.on === 'function') {
    geocoder.on('addresschosen', () => {
      suppressMapSearchCenterFor(GEOCODER_PAN_SUPPRESS_CENTER_MS);
      scheduleKarteSearchGeocoderJump();
    });
  }
  karteGeocoderSource = typeof geocoder.getSource === 'function' ? geocoder.getSource() : null;
  const geocoderLayer = typeof geocoder.getLayer === 'function' ? geocoder.getLayer() : null;
  if (geocoderLayer && typeof geocoderLayer.setZIndex === 'function') {
    geocoderLayer.setZIndex(9);
  }
  if (karteGeocoderSource && typeof karteGeocoderSource.on === 'function') {
    karteGeocoderSource.on('addfeature', (evt) => {
      if (karteGeocoderSyncingMarker) return;
      if (!evt || !evt.feature) return;
      if (karteGeocoderSource.getFeatures().length <= 1) return;
      karteGeocoderSyncingMarker = true;
      karteGeocoderSource.clear();
      karteGeocoderSource.addFeature(evt.feature);
      karteGeocoderSyncingMarker = false;
    });
  }

  const input = wrap.querySelector('.gcd-txt-input');
  if (input) {
    input.setAttribute('aria-label', 'Adresse suchen');
    karteGeocoderInput = input;
    input.addEventListener('input', () => clearKarteGeocoderMarker());
  }

  const searchButton = wrap.querySelector('.gcd-txt-search');
  if (searchButton) {
    searchButton.addEventListener('click', () => clearKarteGeocoderMarker());
  }
}

function setKarteSearchActive(isActive, mapTarget) {
  karteSearchActive = !!isActive;
  const target = mapTarget || document.getElementById('karteMap');
  if (target) {
    target.classList.toggle('karteMap--search', karteSearchActive);
  }
  if (karteSearchButton) {
    karteSearchButton.classList.toggle('is-active', karteSearchActive);
    karteSearchButton.setAttribute('aria-pressed', karteSearchActive ? 'true' : 'false');
  }
  if (!karteSearchActive) {
    karteSearchDragging = false;
    karteSearchHasUserInteraction = false;
    resetKarteSearchDot();
  } else {
    karteSearchDragging = false;
    karteSearchSnapping = false;
    karteSearchHasUserInteraction = false;
    karteSearchSnapTarget = null;
    if (karteSearchSnapTimeout) {
      clearTimeout(karteSearchSnapTimeout);
      karteSearchSnapTimeout = null;
    }
    karteSearchHasUserInteraction = false;
    scheduleKarteSearchDotUpdate();
  }
  scheduleKarteSearchBarUpdate();
  setKartePanningEnabled(karteSearchActive);
  setKarteZoomInteractionsEnabled(karteSearchActive);
  focusStationInputIfAvailable();
}

function initKartePinchZoomLock(mapTarget) {
  if (!karteMap || !mapTarget) return;
  const view = karteMap.getView ? karteMap.getView() : null;
  if (!view || typeof view.on !== 'function') return;

  const rememberCenter = () => {
    const center = view.getCenter ? view.getCenter() : null;
    kartePinchCenter = center ? center.slice() : null;
  };

  const lockCenter = () => {
    if (!kartePinchZooming || !kartePinchCenter || typeof view.setCenter !== 'function') return;
    view.setCenter(kartePinchCenter);
  };

  const stopPinch = (evt) => {
    if (evt && evt.touches && evt.touches.length >= 2) return;
    kartePinchZooming = false;
    kartePinchCenter = null;
  };

  view.on('change:resolution', lockCenter);

  mapTarget.addEventListener('touchstart', (evt) => {
    if (!evt.touches || evt.touches.length < 2) return;
    if (!kartePinchZooming) {
      kartePinchZooming = true;
      rememberCenter();
    }
  }, { passive: true });

  mapTarget.addEventListener('touchmove', (evt) => {
    if (!evt.touches || evt.touches.length < 2) return;
    if (!kartePinchZooming) {
      kartePinchZooming = true;
      rememberCenter();
    }
    lockCenter();
  }, { passive: true });

  mapTarget.addEventListener('touchend', stopPinch, { passive: true });
  mapTarget.addEventListener('touchcancel', stopPinch, { passive: true });
}

function setKartePanningEnabled(isEnabled) {
  if (!karteMap || !window.ol || !ol.interaction) return;
  const interactions = karteMap.getInteractions ? karteMap.getInteractions() : null;
  if (!interactions || typeof interactions.forEach !== 'function') return;

  const types = [ol.interaction.DragPan, ol.interaction.KeyboardPan].filter(Boolean);
  if (!types.length) return;

  interactions.forEach((interaction) => {
    if (!interaction || typeof interaction.setActive !== 'function') return;
    if (types.some(type => interaction instanceof type)) {
      interaction.setActive(!!isEnabled);
    }
  });
}

function setKarteZoomInteractionsEnabled(isEnabled) {
  if (!karteMap || !window.ol || !ol.interaction) return;
  const interactions = karteMap.getInteractions ? karteMap.getInteractions() : null;
  if (!interactions || typeof interactions.forEach !== 'function') return;

  const alwaysEnabledTypes = [
    ol.interaction.MouseWheelZoom,
    ol.interaction.PinchZoom
  ].filter(Boolean);

  const types = [
    ol.interaction.MouseWheelZoom,
    ol.interaction.DoubleClickZoom,
    ol.interaction.PinchZoom,
    ol.interaction.PinchRotate,
    ol.interaction.KeyboardZoom,
    ol.interaction.DragZoom
  ].filter(Boolean);
  if (!types.length) return;

  interactions.forEach((interaction) => {
    if (!interaction || typeof interaction.setActive !== 'function') return;
    if (alwaysEnabledTypes.some(type => interaction instanceof type)) {
      interaction.setActive(true);
      return;
    }
    if (types.some(type => interaction instanceof type)) {
      interaction.setActive(!!isEnabled);
    }
  });
}

function scheduleKarteStationCenterOnZoom() {
  if (karteZoomCenterFrame) {
    cancelAnimationFrame(karteZoomCenterFrame);
  }
  if (typeof requestAnimationFrame === 'function') {
    karteZoomCenterFrame = requestAnimationFrame(() => {
      karteZoomCenterFrame = null;
      updateKarteStationCenter();
    });
  } else {
    updateKarteStationCenter();
  }
}

function ensureInitialMapZoom(view) {
  if (!view || typeof view.getZoom !== 'function') return;
  const zoom = view.getZoom();
  if (!Number.isFinite(zoom)) return;
  if (zoom < INITIAL_MAP_ZOOM && typeof view.setZoom === 'function') {
    view.setZoom(INITIAL_MAP_ZOOM);
  }
}

function fitMapToBabExtent(babId) {
  if (!babId || !karteMap || !karteAbschnittFeatures.length || !absOptionsByAoa.size || !ol.extent) {
    return false;
  }
  const target = String(babId).trim();
  if (!target) return false;

  const aoaSet = new Set();
  absOptionsByAoa.forEach((option, aoa) => {
    if (!option) return;
    const bab = option.bab ? String(option.bab).trim() : '';
    if (!bab) return;
    if (bab === target) {
      aoaSet.add(String(aoa));
    }
  });

  if (!aoaSet.size) return false;

  const extent = ol.extent.createEmpty();
  let added = false;
  karteAbschnittFeatures.forEach((feature) => {
    if (!feature || typeof feature.get !== 'function') return;
    const aoa = feature.get('aoa');
    if (!aoaSet.has(String(aoa))) return;
    const geometry = feature.getGeometry ? feature.getGeometry() : null;
    if (!geometry) return;
    ol.extent.extend(extent, geometry.getExtent());
    added = true;
  });

  if (!added || ol.extent.isEmpty(extent)) return false;

  if (target === INITIAL_BAB_FIT) {
    const extentWidth = ol.extent.getWidth ? ol.extent.getWidth(extent) : extent[2] - extent[0];
    const extentHeight = ol.extent.getHeight ? ol.extent.getHeight(extent) : extent[3] - extent[1];
    const buffer = Math.max(extentWidth, extentHeight) * A99_EXTENT_BUFFER_RATIO;
    if (Number.isFinite(buffer) && buffer > 0) {
      if (ol.extent.buffer) {
        ol.extent.buffer(extent, buffer, extent);
      } else {
        extent[0] -= buffer;
        extent[1] -= buffer;
        extent[2] += buffer;
        extent[3] += buffer;
      }
    }
  }
  karteMap.getView().fit(extent, {
    padding: getKarteLensFitPadding(),
    duration: 0,
    maxZoom: 12
  });
  ensureInitialMapZoom(karteMap.getView());
  karteAbschnittExtentFitted = true;
  karteInitialBabFitted = true;
  return true;
}

function initKarteLensMap(mapTarget) {
  const lensWrapper = document.getElementById('karteLens');
  if (!karteMap || !lensWrapper) return;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'karteLensToggleBtn';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.setAttribute('title', 'Luftbild anzeigen');
  toggle.setAttribute('aria-label', 'Luftbild anzeigen');
  mapTarget.appendChild(toggle);

  karteLensToggleBtn = toggle;

  const tilesWrap = document.createElement('div');
  tilesWrap.className = 'karteOutputTiles';
  mapTarget.appendChild(tilesWrap);
  karteOutputTiles = tilesWrap;

  const aoaTile = document.getElementById('aoaOutput')?.closest('.bkmTafel--aoa');
  const refTile = document.getElementById('refOutput')?.closest('.bkmTafel--aoa');
  const panTile = document.getElementById('panOutput')?.closest('.bkmTafel--aoa');
  const utmTile = document.getElementById('utmOutput')?.closest('.bkmTafel--aoa');
  const latLonTile = document.getElementById('latLonOutput')?.closest('.bkmTafel--aoa');
  if (panTile) {
    tilesWrap.appendChild(panTile);
  }
  if (refTile) {
    tilesWrap.appendChild(refTile);
  }
  if (aoaTile) {
    tilesWrap.appendChild(aoaTile);
  }
  if (utmTile) {
    tilesWrap.appendChild(utmTile);
  }
  if (latLonTile) {
    tilesWrap.appendChild(latLonTile);
  }
  if ((aoaTile || refTile || panTile || utmTile || latLonTile) && referenzGraphic) {
    referenzGraphic.classList.add('has-external-tiles');
  }
  updateKarteOutputTilesVisibility();

  toggle.addEventListener('click', () => {
    setKarteLensEnabled(!karteLensEnabled, mapTarget);
    focusStationInputIfAvailable();
  });

  syncKarteLensToggleSize(mapTarget);
  requestAnimationFrame(() => syncKarteMstPosition(mapTarget));
  if (karteLensToggleResizeObserver) {
    karteLensToggleResizeObserver.disconnect();
  }
  if (typeof ResizeObserver === 'function') {
    karteLensToggleResizeObserver = new ResizeObserver(() => {
      syncKarteLensToggleSize(mapTarget);
    });
    karteLensToggleResizeObserver.observe(mapTarget);
  } else {
    window.addEventListener('resize', () => syncKarteLensToggleSize(mapTarget));
  }

  setKarteLensEnabled(false, mapTarget);
  syncKarteLensSize(mapTarget);
  if (karteLensResizeObserver) {
    karteLensResizeObserver.disconnect();
  }
  if (typeof ResizeObserver === 'function') {
    karteLensResizeObserver = new ResizeObserver(() => {
      syncKarteLensSize(mapTarget);
    });
    karteLensResizeObserver.observe(mapTarget);
  } else {
    window.addEventListener('resize', () => syncKarteLensSize(mapTarget));
  }
}

function focusStationInputIfAvailable() {
  const stationInput = document.querySelector('.stationRow .ts-number-input');
  if (!stationInput || stationInput.disabled) return;
  const stationText = getOutputText(stationOutput).trim();
  if (!stationText) return;
  try {
    stationInput.focus({ preventScroll: true });
  } catch (err) {
    stationInput.focus();
  }
}

function buildStreetViewUrl(lat, lon) {
  const safeLat = Number(lat).toFixed(6);
  const safeLon = Number(lon).toFixed(6);
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${safeLat},${safeLon}`;
}

function formatUtmCenter(center) {
  if (!Array.isArray(center) || center.length < 2) return '';
  const viewProjection = karteMap && karteMap.getView ? karteMap.getView().getProjection() : null;
  if (!viewProjection || !window.ol || !ol.proj) return '';
  const lonLat = ol.proj.transform(center, viewProjection, 'EPSG:4326');
  if (!lonLat || !Number.isFinite(lonLat[0]) || !Number.isFinite(lonLat[1])) return '';
  const lon = lonLat[0];
  const lat = lonLat[1];
  const zone = lon >= 12 ? 33 : 32;
  const band = getUtmBandLetter(lat);
  const epsg = zone === 33 ? 'EPSG:25833' : 'EPSG:25832';
  const utmCoord = (typeof viewProjection.getCode === 'function' && viewProjection.getCode() === epsg)
    ? center
    : ol.proj.transform(lonLat, 'EPSG:4326', epsg);
  const easting = Number(utmCoord[0]);
  const northing = Number(utmCoord[1]);
  if (!Number.isFinite(easting) || !Number.isFinite(northing)) return '';
  return `${zone}${band} ${Math.round(easting)} ${Math.round(northing)}`;
}

function formatLatLonCenter(center) {
  if (!Array.isArray(center) || center.length < 2) return '';
  const viewProjection = karteMap && karteMap.getView ? karteMap.getView().getProjection() : null;
  if (!viewProjection || !window.ol || !ol.proj) return '';
  const lonLat = ol.proj.transform(center, viewProjection, 'EPSG:4326');
  if (!lonLat || !Number.isFinite(lonLat[0]) || !Number.isFinite(lonLat[1])) return '';
  const lon = lonLat[0];
  const lat = lonLat[1];
  const formatOptions = { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  const latText = lat.toLocaleString('de-DE', formatOptions);
  const lonText = lon.toLocaleString('de-DE', formatOptions);
  return `${latText} ${lonText}`;
}

function getUtmBandLetter(lat) {
  if (!Number.isFinite(lat) || lat < -80 || lat > 84) return '';
  const bands = 'CDEFGHJKLMNPQRSTUVWX';
  const index = Math.min(bands.length - 1, Math.floor((lat + 80) / 8));
  return bands.charAt(index);
}

function updatePanOutput() {
  if (!panOutput || !karteMap || !window.ol || !ol.proj) return;
  const view = karteMap.getView ? karteMap.getView() : null;
  const center = view ? view.getCenter() : null;
  if (!center) return;
  const projection = view.getProjection ? view.getProjection() : null;
  if (!projection) return;
  const lonLat = ol.proj.transform(center, projection, 'EPSG:4326');
  if (!lonLat || !Number.isFinite(lonLat[0]) || !Number.isFinite(lonLat[1])) return;
  const url = buildStreetViewUrl(lonLat[1], lonLat[0]);
  panOutput.setAttribute('href', url);
}

function updateUtmOutput() {
  if (!utmOutput || !karteMap) return;
  const view = karteMap.getView ? karteMap.getView() : null;
  const center = view ? view.getCenter() : null;
  if (!center) {
    setOutputValue(utmOutput, '');
    updateKarteOutputTilesVisibility();
    return;
  }
  setOutputValue(utmOutput, formatUtmCenter(center));
  updateKarteOutputTilesVisibility();
}

function updateLatLonOutput() {
  if (!latLonOutput || !karteMap) return;
  const view = karteMap.getView ? karteMap.getView() : null;
  const center = view ? view.getCenter() : null;
  if (!center) {
    setOutputValue(latLonOutput, '');
    updateKarteOutputTilesVisibility();
    return;
  }
  setOutputValue(latLonOutput, formatLatLonCenter(center));
  updateKarteOutputTilesVisibility();
}

function getKarteScaleRatioText() {
  if (!karteScaleControl || !karteScaleControl.element) return '';
  const textEl = karteScaleControl.element.querySelector('.ol-scale-text');
  if (!textEl) return '';
  const rawText = (textEl.textContent || '').trim();
  if (!rawText) return '';
  const match = rawText.match(/1\s*:\s*([0-9.,]+)/);
  if (!match) return rawText;
  const numeric = parseInt(match[1].replace(/[^0-9]/g, ''), 10);
  if (!Number.isFinite(numeric)) return rawText;
  const formatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
  return `1 : ${formatter.format(numeric)}`;
}

function updateScaleOutput() {
  if (!scaleOutput) return;
  const text = getKarteScaleRatioText();
  setOutputValue(scaleOutput, text);
  updateKarteOutputTilesVisibility();
}

function setKarteLensEnabled(enabled, mapTarget) {
  karteLensEnabled = !!enabled;
  const target = mapTarget || document.getElementById('karteMap');
  if (target) {
    target.classList.toggle('karteMap--lens-off', !karteLensEnabled);
  }
  if (karteLensToggleBtn) {
    karteLensToggleBtn.classList.toggle('show-base', karteLensEnabled);
    karteLensToggleBtn.setAttribute('aria-pressed', karteLensEnabled ? 'true' : 'false');
    if (karteLensEnabled) {
      karteLensToggleBtn.setAttribute('title', 'Karte anzeigen');
      karteLensToggleBtn.setAttribute('aria-label', 'Karte anzeigen');
    } else {
      karteLensToggleBtn.setAttribute('title', 'Luftbild anzeigen');
      karteLensToggleBtn.setAttribute('aria-label', 'Luftbild anzeigen');
    }
  }
  const lensWrapper = document.getElementById('karteLens');
  if (lensWrapper) {
    lensWrapper.style.display = '';
  }
  if (karteMapAerialLayer && typeof karteMapAerialLayer.setVisible === 'function') {
    karteMapAerialLayer.setVisible(karteLensEnabled);
  }
}

function syncKarteLensSize(mapTarget) {
  const target = mapTarget || document.getElementById('karteMap');
  const lensWrapper = document.getElementById('karteLens');
  if (!target || !lensWrapper) return;
  const rect = target.getBoundingClientRect();
  if (!rect || !rect.width || !rect.height) return;
  const bottomOffset = getKarteLensBottomOffset();
  const sizeByHeight = Math.max(0, rect.height - (2 * bottomOffset));
  const size = Math.max(0, Math.min(rect.width, sizeByHeight));
  const radius = Math.max(0, size / 2);
  lensWrapper.style.setProperty('--lens-size', `${size}px`);
  lensWrapper.style.setProperty('--lens-radius', `${radius}px`);
  target.style.setProperty('--lens-size', `${size}px`);
  target.style.setProperty('--lens-radius', `${radius}px`);
}

function getKarteLensBottomOffset() {
  return 24;
}

function getKarteLensFitPadding(mapTarget) {
  const target = mapTarget
    || (karteMap && typeof karteMap.getTargetElement === 'function' ? karteMap.getTargetElement() : null)
    || document.getElementById('karteMap');
  if (!target) return [20, 20, 20, 20];
  const rect = target.getBoundingClientRect();
  if (!rect || !rect.width || !rect.height) return [20, 20, 20, 20];
  const bottomOffset = getKarteLensBottomOffset();
  const lensSize = Math.max(0, Math.min(rect.width, rect.height - (2 * bottomOffset)));
  const padX = Math.max(0, Math.round((rect.width - lensSize) / 2));
  const padY = Math.max(0, Math.round((rect.height - lensSize) / 2));
  return [padY, padX, padY, padX];
}

function getKarteSnapFrameExtent() {
  if (!karteMap || !karteSearchFrame) return null;
  const target = karteMap.getTargetElement ? karteMap.getTargetElement() : document.getElementById('karteMap');
  if (!target) return null;
  const mapRect = target.getBoundingClientRect();
  const frameRect = karteSearchFrame.getBoundingClientRect();
  if (!mapRect.width || !mapRect.height) return null;

  const topLeftPx = [frameRect.left - mapRect.left, frameRect.top - mapRect.top];
  const bottomRightPx = [frameRect.right - mapRect.left, frameRect.bottom - mapRect.top];
  const topLeftCoord = karteMap.getCoordinateFromPixel(topLeftPx);
  const bottomRightCoord = karteMap.getCoordinateFromPixel(bottomRightPx);
  if (!topLeftCoord || !bottomRightCoord || !ol.extent) return null;
  return ol.extent.boundingExtent([topLeftCoord, bottomRightCoord]);
}

function getKarteSnapFrameWidth() {
  const snapExtent = getKarteSnapFrameExtent();
  if (!snapExtent || !ol.extent || typeof ol.extent.getWidth !== 'function') return null;
  const width = ol.extent.getWidth(snapExtent);
  return Number.isFinite(width) ? Math.abs(width) : null;
}

function formatKarteSearchBarWidth(width, units) {
  if (!Number.isFinite(width)) return '';
  const cleanUnits = typeof units === 'string' ? units.trim() : '';
  const absWidth = Math.abs(width);
  if (cleanUnits === 'm' || cleanUnits === 'meter' || cleanUnits === 'meters'
    || cleanUnits === 'metre' || cleanUnits === 'metres') {
    if (absWidth >= 1000) {
      const kmText = (absWidth / 1000).toLocaleString('de-DE', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
      return kmText ? `${kmText} km` : '';
    }
    const mText = metersToM(absWidth);
    return mText ? `${mText} m` : '';
  }
  if (cleanUnits === 'degrees') {
    const degText = absWidth.toLocaleString('de-DE', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5
    });
    return `${degText} °`;
  }
  const valueText = absWidth.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const unitLabel = cleanUnits || 'u';
  return `${valueText} ${unitLabel}`;
}

function updateKarteSearchBar() {
  if (!karteSearchBarLabel) return;
  const width = getKarteSnapFrameWidth();
  if (!Number.isFinite(width)) {
    karteSearchBarLabel.textContent = '';
    return;
  }
  const view = karteMap && karteMap.getView ? karteMap.getView() : null;
  const projection = view && typeof view.getProjection === 'function' ? view.getProjection() : null;
  const units = projection && typeof projection.getUnits === 'function' ? projection.getUnits() : null;
  const text = formatKarteSearchBarWidth(width, units);
  karteSearchBarLabel.textContent = text;
}

function scheduleKarteSearchBarUpdate() {
  if (!karteSearchBarLabel) return;
  if (karteSearchBarUpdateFrame) return;
  karteSearchBarUpdateFrame = requestAnimationFrame(() => {
    karteSearchBarUpdateFrame = null;
    updateKarteSearchBar();
  });
}

function getKarteSearchSnapMatch() {
  const snapExtent = getKarteSnapFrameExtent();
  if (!snapExtent) return null;
  return findKarteSearchMatch({ extent: snapExtent });
}

function resetKarteSearchDot() {
  if (!karteSearchDot) return;
  karteSearchDot.style.transition = 'transform 0.3s ease-in';
  karteSearchDot.style.transform = 'translate(-50%, -50%)';
}

function setKarteSearchDotPosition(coord) {
  if (!karteSearchDot || !karteMap) return;
  const view = karteMap.getView();
  const center = view ? view.getCenter() : null;
  if (!center) {
    resetKarteSearchDot();
    return;
  }
  const snappedPx = karteMap.getPixelFromCoordinate(coord);
  const centerPx = karteMap.getPixelFromCoordinate(center);
  if (!snappedPx || !centerPx) {
    resetKarteSearchDot();
    return;
  }
  const dx = snappedPx[0] - centerPx[0];
  const dy = snappedPx[1] - centerPx[1];
  karteSearchDot.style.transition = 'none';
  karteSearchDot.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

function updateKarteSearchDot() {
  if (!karteSearchActive || !karteSearchDot || !karteMap) return;
  if (!karteSearchHasUserInteraction) {
    resetKarteSearchDot();
    return;
  }
  const targetCoord = karteSearchSnapping && karteSearchSnapTarget
    ? karteSearchSnapTarget
    : null;
  if (targetCoord) {
    setKarteSearchDotPosition(targetCoord);
    return;
  }
  const match = getKarteSearchSnapMatch();
  if (!match || !match.coordinate) {
    resetKarteSearchDot();
    return;
  }
  setKarteSearchDotPosition(match.coordinate);
}

function scheduleKarteSearchDotUpdate() {
  if (!karteSearchActive) return;
  if (karteSearchDotFrame) return;
  karteSearchDotFrame = requestAnimationFrame(() => {
    karteSearchDotFrame = null;
    updateKarteSearchDot();
  });
}

function scheduleKarteSearchGeocoderJump() {
  karteSearchHasUserInteraction = true;
  karteSearchGeocoderPending = true;
}

function flashKarteSnapCorners() {
  if (!karteSearchCorners || !karteSearchCorners.length) return;
  karteSearchCorners.forEach((corner) => {
    corner.classList.remove('snap-flash');
    void corner.offsetWidth;
    corner.classList.add('snap-flash');
  });
}

function snapKarteSearchToMatch(match) {
  if (!karteMap || !match || !match.coordinate) return;
  const view = karteMap.getView();
  if (!view) return;
  if (karteSearchSnapping) return;

  const distance = Number.isFinite(match.distance) ? match.distance : 0;
  if (distance <= MAP_SEARCH_SNAP_MIN_DISTANCE) {
    selectAbschnittFromMapSearch(match);
    return;
  }

  karteSearchSnapping = true;
  karteSearchSnapTarget = match.coordinate;
  flashKarteSnapCorners();

  if (karteSearchSnapTimeout) {
    clearTimeout(karteSearchSnapTimeout);
  }
  karteSearchSnapTimeout = setTimeout(() => {
    karteSearchSnapping = false;
    karteSearchSnapTarget = null;
  }, MAP_SEARCH_SNAP_TIMEOUT);

  view.animate(
    {
      center: match.coordinate,
      duration: MAP_SEARCH_SNAP_DURATION,
      easing: (t) => t
    },
    () => {
      karteSearchSnapping = false;
      karteSearchSnapTarget = null;
      if (karteSearchSnapTimeout) {
        clearTimeout(karteSearchSnapTimeout);
        karteSearchSnapTimeout = null;
      }
    resetKarteSearchDot();
    selectAbschnittFromMapSearch({ ...match, skipCenterAnimation: true });
    }
  );
}

function handleKarteSearchMoveEnd() {
  if (karteSearchSnapping) return;
  if (!karteSearchHasUserInteraction) return;
  const match = getKarteSearchSnapMatch();
  if (!match) {
    resetKarteSearchSelection();
    karteSearchHasUserInteraction = false;
    resetKarteSearchDot();
    return;
  }
  const distance = Number.isFinite(match.distance) ? match.distance : 0;
  if (distance > MAP_SEARCH_SNAP_MIN_DISTANCE) {
    snapKarteSearchToMatch(match);
    return;
  }
  selectAbschnittFromMapSearch(match);
}

function handleKarteSearchGeocoderJump() {
  if (karteSearchSnapping) return;
  const match = getKarteSearchSnapMatch();
  if (!match) {
    resetKarteSearchSelection();
    karteSearchHasUserInteraction = false;
    resetKarteSearchDot();
    return;
  }
  snapKarteSearchToMatch(match);
}

function resetKarteSearchSelection() {
  lastAbschnittId = null;
  if (babSelect) {
    babSelect.clear(true);
    updateBabResetOptionAvailability();
  }
  if (absSelect) {
    absSelect.clear(true);
  }
  absOptionsAll = absOptionsGlobal;
  setKilometerFilterEnabled(false);
  setAbsSelectorEnabled(absOptionsAll.length > 0);
  applyAbschnittFilter({ resetSelection: true });
  updateKarteAbschnitt(null);
  resetStationState();
  updateReferenceOutputs();
}

function resetKarteViewToDefault() {
  if (!karteMap) return;
  if (INITIAL_BAB_FIT && fitMapToBabExtent(INITIAL_BAB_FIT)) return;
  if (!karteAbschnittFeatures.length || !ol || !ol.extent) return;
  const extent = ol.extent.createEmpty();
  karteAbschnittFeatures.forEach((feature) => {
    const geometry = feature && typeof feature.getGeometry === 'function' ? feature.getGeometry() : null;
    if (!geometry) return;
    ol.extent.extend(extent, geometry.getExtent());
  });
  if (!ol.extent.isEmpty(extent)) {
    karteMap.getView().fit(extent, {
      padding: getKarteLensFitPadding(),
      duration: 0,
      maxZoom: 12
    });
    ensureInitialMapZoom(karteMap.getView());
  }
}

function initKarteAbschnittLayer(projection) {
  if (!karteMap || !projection) return;
  if (!ol || !ol.source || !ol.layer || !ol.style) return;

  karteAbschnittSource = new ol.source.Vector();
  const abschnittStroke = new ol.style.Stroke({
    color: ABSCHNITT_STROKE_COLOR,
    width: 6,
    lineCap: 'round',
    lineJoin: 'round'
  });
  const abschnittStyle = new ol.style.Style({
    stroke: abschnittStroke
  });
  const abschnittLabelStyles = new Map();
  const highlightLabelStyles = new Map();
  const abschnittLabelFill = new ol.style.Fill({ color: ABSCHNITT_LABEL_COLOR });
  const abschnittLabelHalo = new ol.style.Stroke({ color: ABSCHNITT_LABEL_HALO_COLOR, width: 3 });
  const abschnittHiddenStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0)',
      width: 9
    })
  });
  const getAbschnittLabel = (feature, resolution) => {
    const aoa = feature && typeof feature.get === 'function' ? feature.get('aoa') : '';
    const absOption = absOptionsByAoa.get(String(aoa));
    const babLabel = absOption && absOption.bab !== undefined && absOption.bab !== null
      ? String(absOption.bab).trim()
      : '';
    const absLabel = absOption && absOption.abs !== undefined && absOption.abs !== null
      ? String(absOption.abs).trim()
      : '';
    const rawLabel = [babLabel, absLabel].filter(Boolean).join('\n');
    const label = rawLabel !== undefined && rawLabel !== null ? String(rawLabel).trim() : '';
    if (!label || !shouldShowAbschnittLabel(feature, resolution)) {
      return '';
    }
    return label;
  };
  const getAbschnittStyle = (feature, resolution) => {
    const aoa = feature && typeof feature.get === 'function' ? feature.get('aoa') : '';
    if (selectedAbschnittAoa && String(aoa) === selectedAbschnittAoa) {
      return abschnittHiddenStyle;
    }
    const label = getAbschnittLabel(feature, resolution);
    if (!label) {
      return abschnittStyle;
    }
    let style = abschnittLabelStyles.get(label);
    if (!style) {
      style = new ol.style.Style({
        stroke: abschnittStroke,
        text: new ol.style.Text({
          text: label,
          placement: 'line',
          overflow: false,
          textBaseline: 'middle',
          textAlign: 'center',
          font: '12px roboto-bold, sans-serif',
          fill: abschnittLabelFill,
          stroke: abschnittLabelHalo,
          padding: [1, 2, 1, 2]
        })
      });
      abschnittLabelStyles.set(label, style);
    }
    return style;
  };
  const abschnittLayer = new ol.layer.Vector({
    source: karteAbschnittSource,
    zIndex: 4.5,
    declutter: true,
    style: getAbschnittStyle
  });
  karteAbschnittLayer = abschnittLayer;
  karteMap.addLayer(abschnittLayer);

  karteHighlightSource = new ol.source.Vector();
  const highlightStroke = new ol.style.Stroke({
    color: ABSCHNITT_HIGHLIGHT_COLOR,
    width: 6,
    lineCap: 'round',
    lineJoin: 'round'
  });
  const highlightStyle = new ol.style.Style({
    stroke: highlightStroke
  });
  const getHighlightStyle = (feature, resolution) => {
    const label = getAbschnittLabel(feature, resolution);
    if (!label) {
      return highlightStyle;
    }
    let style = highlightLabelStyles.get(label);
    if (!style) {
      style = new ol.style.Style({
        stroke: highlightStroke,
        text: new ol.style.Text({
          text: label,
          placement: 'line',
          overflow: false,
          textBaseline: 'middle',
          textAlign: 'center',
          font: '12px roboto-bold, sans-serif',
          fill: abschnittLabelFill,
          stroke: abschnittLabelHalo,
          padding: [1, 2, 1, 2]
        })
      });
      highlightLabelStyles.set(label, style);
    }
    return style;
  };
  const highlightLayer = new ol.layer.Vector({
    source: karteHighlightSource,
    zIndex: 5,
    declutter: true,
    style: getHighlightStyle
  });
  karteMap.addLayer(highlightLayer);

  fetch('obj/abs.geojson')
    .then((res) => res.json())
    .then((data) => {
      const format = new ol.format.GeoJSON();
      const dataProjection = resolveGeoJsonDataProjection(data);
      const features = format.readFeatures(data, {
        dataProjection,
        featureProjection: projection
      });

      karteAbschnittByAoa = new Map();
      karteAbschnittFeatures = features;
      features.forEach((feature) => {
        const aoa = feature.get('aoa');
        if (!aoa) return;
        karteAbschnittByAoa.set(String(aoa), feature);
      });

      if (karteAbschnittSource) {
        karteAbschnittSource.clear();
        karteAbschnittSource.addFeatures(features);
      }
      karteAbschnittGeometryRevision += 1;
      refreshNetzknotenLabelDisplacements();

      if (INITIAL_BAB_FIT && !karteInitialBabFitted) {
        const fitted = fitMapToBabExtent(INITIAL_BAB_FIT);
        if (fitted) {
          return;
        }
      }

      if (karteMap && !karteAbschnittExtentFitted && features.length && ol.extent) {
        const extent = ol.extent.createEmpty();
        features.forEach((feature) => {
          const geometry = feature.getGeometry();
          if (!geometry) return;
          ol.extent.extend(extent, geometry.getExtent());
        });
        if (!ol.extent.isEmpty(extent)) {
          karteMap.getView().fit(extent, {
            padding: getKarteLensFitPadding(),
            duration: 0,
            maxZoom: 12
          });
          ensureInitialMapZoom(karteMap.getView());
          karteAbschnittExtentFitted = true;
        }
      }

      updateKarteAbschnitt(getSelectedAbsOption());
    })
    .catch((err) => {
      console.error('abs.geojson konnte nicht geladen werden:', err);
    });
}

function initKarteNetzknotenLayer(projection) {
  if (!karteMap || !projection) return;
  if (!ol || !ol.source || !ol.layer || !ol.style) return;

  karteNetzknotenSource = new ol.source.Vector();

  const pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 3.5,
      fill: new ol.style.Fill({ color: '#005a8c' }),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 1.5 })
    }),
    zIndex: 5.3
  });
  const getPointStyle = () => {
    const view = karteMap && typeof karteMap.getView === 'function' ? karteMap.getView() : null;
    const zoom = view && typeof view.getZoom === 'function' ? view.getZoom() : null;
    if (Number.isFinite(zoom) && zoom < NETZKNOTEN_POINT_MIN_ZOOM) {
      return null;
    }
    return pointStyle;
  };
  const labelStyles = new Map();
  const labelSignCache = new Map();
  const compactLabelSignCache = new Map();

  const getLabelStyle = (feature, resolution) => {
    const bab = feature && typeof feature.get === 'function'
      ? String(feature.get('bab') || '').trim()
      : '';
    const kt = normalizeNetzknotenKtValue(feature && typeof feature.get === 'function' ? feature.get('kt') : '');
    const asParts = normalizeNetzknotenAsParts(feature && typeof feature.get === 'function' ? feature.get('as') : '');
    if (!shouldShowNetzknotenLabel(resolution)) {
      return null;
    }

    const view = karteMap && typeof karteMap.getView === 'function' ? karteMap.getView() : null;
    const zoom = view && typeof view.getZoom === 'function' ? view.getZoom() : null;
    const zoomBucket = Number.isFinite(zoom) ? Math.round(zoom * 2) / 2 : null;
    const useCompactLabel = shouldUseCompactNetzknotenLabel(zoomBucket);
    if (useCompactLabel && !bab) {
      return null;
    }
    if (!useCompactLabel && !asParts.text) {
      return null;
    }
    const signKey = useCompactLabel
      ? `bab|${bab}|${kt}`
      : `full|${asParts.type}|${kt}|${asParts.text}`;
    const signCache = useCompactLabel ? compactLabelSignCache : labelSignCache;
    let sign = signCache.get(signKey);
    if (!sign) {
      sign = useCompactLabel
        ? createNetzknotenCompactBabSignSvg({
          babText: bab,
          ktText: kt
        })
        : createNetzknotenSignSvg({
          type: asParts.type,
          ktText: kt,
          asText: asParts.text
        });
      signCache.set(signKey, sign);
    }

    const placement = getNetzknotenLabelPlacement(feature, sign.width, sign.height, resolution, zoomBucket);
    const anchorX = placement && Number.isFinite(placement.anchorX)
      ? placement.anchorX
      : NETZKNOTEN_LABEL_FALLBACK_ANCHOR_X;
    const anchorY = placement && Number.isFinite(placement.anchorY)
      ? placement.anchorY
      : NETZKNOTEN_LABEL_FALLBACK_ANCHOR_Y;
    const dx = placement && Number.isFinite(placement.dx) ? placement.dx : NETZKNOTEN_LABEL_POINT_GAP_PX;
    const dy = placement && Number.isFinite(placement.dy) ? placement.dy : NETZKNOTEN_LABEL_POINT_GAP_PX;
    const key = `${signKey}|${anchorX}|${anchorY}|${dx}|${dy}|${zoomBucket}`;
    let style = labelStyles.get(key);
    if (!style) {
      const src = `data:image/svg+xml;utf8,${encodeURIComponent(sign.svg)}`;
      style = new ol.style.Style({
        image: new ol.style.Icon({
          src,
          opacity: NETZKNOTEN_LABEL_OPACITY,
          anchor: [anchorX, anchorY],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          displacement: [dx, dy]
        }),
        zIndex: 5.4
      });
      labelStyles.set(key, style);
    }
    return style;
  };

  const pointLayer = new ol.layer.Vector({
    source: karteNetzknotenSource,
    zIndex: 5.3,
    declutter: false,
    style: getPointStyle
  });
  karteMap.addLayer(pointLayer);

  karteNetzknotenLayer = new ol.layer.Vector({
    source: karteNetzknotenSource,
    zIndex: 5.4,
    declutter: true,
    style: getLabelStyle
  });
  karteMap.addLayer(karteNetzknotenLayer);

  fetch('obj/nks.geojson')
    .then((res) => res.json())
    .then((data) => {
      const format = new ol.format.GeoJSON();
      const dataProjection = resolveGeoJsonDataProjection(data);
      const features = format.readFeatures(data, {
        dataProjection,
        featureProjection: projection
      });
      assignNetzknotenStackMetadata(features);
      karteNetzknotenFeatures = features;

      if (karteNetzknotenSource) {
        karteNetzknotenSource.clear();
        karteNetzknotenSource.addFeatures(features);
      }
      refreshNetzknotenLabelDisplacements();
    })
    .catch((err) => {
      console.error('nks.geojson konnte nicht geladen werden:', err);
    });
}

function updateKarteAbschnitt(absOption) {
  if (!karteHighlightSource) return;
  karteHighlightSource.clear();

  const aoa = absOption && absOption.aoa ? String(absOption.aoa) : '';
  selectedAbschnittAoa = aoa || null;
  if (karteAbschnittLayer && typeof karteAbschnittLayer.changed === 'function') {
    karteAbschnittLayer.changed();
  }
  if (!aoa || !karteAbschnittByAoa.size) return;

  const feature = karteAbschnittByAoa.get(aoa);
  if (!feature) return;

  const clone = feature.clone();
  karteHighlightSource.addFeature(clone);
}

function getLineCoordinateAtFraction(geometry, fraction) {
  if (!geometry || typeof geometry.getType !== 'function') return null;
  const clamped = Math.min(1, Math.max(0, fraction));
  const type = geometry.getType();

  if (type === 'LineString' && typeof geometry.getCoordinateAt === 'function') {
    return geometry.getCoordinateAt(clamped);
  }

  if (type === 'MultiLineString' && typeof geometry.getLineStrings === 'function') {
    const lines = geometry.getLineStrings();
    if (!lines.length) return null;
    const lengths = lines.map(line => (line && typeof line.getLength === 'function' ? line.getLength() : 0));
    const totalLength = lengths.reduce((sum, len) => sum + (Number.isFinite(len) ? len : 0), 0);
    if (!Number.isFinite(totalLength) || totalLength <= 0) return null;

    let remaining = clamped * totalLength;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const length = lengths[i];
      if (!line || !Number.isFinite(length) || length <= 0) continue;
      if (remaining <= length || i === lines.length - 1) {
        const localFraction = length > 0 ? Math.min(1, Math.max(0, remaining / length)) : 0;
        return line.getCoordinateAt(localFraction);
      }
      remaining -= length;
    }
  }

  return null;
}

function getGeometryLength(geometry) {
  if (!geometry || typeof geometry.getType !== 'function') return 0;
  const type = geometry.getType();
  if (type === 'LineString' && typeof geometry.getLength === 'function') {
    return geometry.getLength();
  }
  if (type === 'MultiLineString' && typeof geometry.getLineStrings === 'function') {
    return geometry.getLineStrings()
      .map(line => (line && typeof line.getLength === 'function' ? line.getLength() : 0))
      .reduce((sum, len) => sum + (Number.isFinite(len) ? len : 0), 0);
  }
  return 0;
}

function shouldShowAbschnittLabel(feature, resolution) {
  if (!feature) return false;
  const view = karteMap && typeof karteMap.getView === 'function' ? karteMap.getView() : null;
  const zoom = view && typeof view.getZoom === 'function' ? view.getZoom() : null;
  if (Number.isFinite(zoom) && zoom < ABSCHNITT_LABEL_MIN_ZOOM) return false;
  const safeResolution = Number.isFinite(resolution) && resolution > 0 ? resolution : null;
  if (!safeResolution) return false;
  const geometry = typeof feature.getGeometry === 'function' ? feature.getGeometry() : null;
  const length = getGeometryLength(geometry);
  if (!Number.isFinite(length) || length <= 0) return false;
  const pixelLength = length / safeResolution;
  return pixelLength >= ABSCHNITT_LABEL_MIN_PX;
}

function getClosestPointOnGeometry(geometry, target) {
  if (!geometry || !Array.isArray(target)) return null;

  const type = geometry.getType();
  let lines = null;

  if (type === 'LineString' && typeof geometry.getCoordinates === 'function') {
    lines = [geometry.getCoordinates()];
  } else if (type === 'MultiLineString' && typeof geometry.getCoordinates === 'function') {
    lines = geometry.getCoordinates();
  }

  if (!lines || !lines.length) return null;

  let lengthSoFar = 0;
  let minDistSq = Infinity;
  let closest = null;
  let lengthAtClosest = 0;
  let closestNormal = null;

  lines.forEach((coords) => {
    if (!Array.isArray(coords) || coords.length < 2) return;
    for (let i = 0; i < coords.length - 1; i += 1) {
      const a = coords[i];
      const b = coords[i + 1];
      if (!a || !b) continue;

      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const segLenSq = (dx * dx) + (dy * dy);
      if (!Number.isFinite(segLenSq) || segLenSq <= 0) continue;

      const t = ((target[0] - a[0]) * dx + (target[1] - a[1]) * dy) / segLenSq;
      const clamped = Math.min(1, Math.max(0, t));
      const px = a[0] + clamped * dx;
      const py = a[1] + clamped * dy;
      const distSq = (target[0] - px) * (target[0] - px) +
        (target[1] - py) * (target[1] - py);
      const segLen = Math.sqrt(segLenSq);
      const lengthAt = lengthSoFar + segLen * clamped;

      if (distSq < minDistSq) {
        minDistSq = distSq;
        closest = [px, py];
        lengthAtClosest = lengthAt;
        closestNormal = [-dy / segLen, dx / segLen];
      }

      lengthSoFar += segLen;
    }
  });

  const totalLength = lengthSoFar;
  if (!closest || !Number.isFinite(totalLength) || totalLength <= 0) return null;

  return {
    point: closest,
    fraction: lengthAtClosest / totalLength,
    distanceSq: minDistSq,
    normal: closestNormal
  };
}

function findKarteSearchMatch({ extent } = {}) {
  if (!karteMap || !karteAbschnittByAoa.size || !absOptionsByAoa.size) return null;
  const size = karteMap.getSize();
  if (!size || size.length < 2) return null;

  const centerPx = [size[0] / 2, size[1] / 2];
  const centerCoord = karteMap.getCoordinateFromPixel(centerPx);
  if (!centerCoord) return null;

  const resolution = karteMap.getView().getResolution();
  if (!Number.isFinite(resolution)) return null;

  const radius = resolution * MAP_SEARCH_RADIUS_PX;
  const radiusSq = radius * radius;
  const useExtent = !!extent;

  let best = null;

  karteAbschnittByAoa.forEach((feature, aoa) => {
    if (!feature || !feature.getGeometry) return;
    const geometry = feature.getGeometry();
    if (!geometry) return;

    if (useExtent && typeof geometry.intersectsExtent === 'function' && !geometry.intersectsExtent(extent)) {
      return;
    }

    const closest = getClosestPointOnGeometry(geometry, centerCoord);
    if (!closest || !Number.isFinite(closest.distanceSq)) return;
    if (!useExtent && closest.distanceSq > radiusSq) return;

    if (!best || closest.distanceSq < best.distanceSq) {
      best = {
        aoa: String(aoa),
        distanceSq: closest.distanceSq,
        fraction: closest.fraction,
        coordinate: closest.point
      };
    }
  });

  if (!best) return null;

  const option = absOptionsByAoa.get(best.aoa);
  if (!option) return null;

  const lngMeters = Number(option.lng);
  if (!Number.isFinite(lngMeters) || lngMeters <= 0) return null;

  const maxKm = lngMeters / 1000;
  const stationKm = Math.min(maxKm, Math.max(0, best.fraction * maxKm));

  return {
    option,
    stationKm,
    coordinate: best.coordinate,
    distance: Math.sqrt(best.distanceSq)
  };
}

function selectAbschnittFromMapSearch({ option, stationKm, coordinate, skipCenterAnimation }) {
  if (!option) return;
  if (karteSearchActive) {
    karteSearchDragging = false;
    karteSearchHasUserInteraction = false;
    resetKarteSearchDot();
  }
  const targetBab = option.bab;
  const targetAbs = option.id;
  stationSliderActive = false;

  const applyAbsSelection = () => {
    if (!absSelect || !targetAbs) return;
    resetKilometerFilterValue();
    applyAbschnittFilter({ resetSelection: true });
    karteSearchSelectingAbschnitt = true;
    karteSearchPendingStationKm = Number.isFinite(stationKm) ? Number(stationKm) : null;
    absSelect.setValue(targetAbs);

    const finalize = () => {
      if (Number.isFinite(stationKm)) {
        suppressMapSearchCenterFor(MAP_SEARCH_POST_SNAP_SUPPRESS_CENTER_MS);
        const stationContainer = document.querySelector('.stationRow .ts-number');
        const input = stationContainer
          ? stationContainer.querySelector('.ts-number-input')
          : null;
        if (input) {
          input.value = Number(stationKm).toFixed(3);
          const ev = new Event('change', { bubbles: true });
          input.dispatchEvent(ev);
        } else {
          setStationValue(stationKm);
        }
      }
      if (karteMap && coordinate && !skipCenterAnimation) {
        karteMap.getView().animate({ center: coordinate, duration: 200 });
      }
      updateReferenceOutputs(stationKm);
      stationSliderActive = false;
      karteSearchSelectingAbschnitt = false;
      karteSearchPendingStationKm = null;
    };

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(finalize);
    } else {
      setTimeout(finalize, 0);
    }
  };

  if (babSelect && targetBab && babSelect.getValue() !== targetBab) {
    babSelect.setValue(targetBab);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(applyAbsSelection);
    } else {
      setTimeout(applyAbsSelection, 0);
    }
  } else {
    applyAbsSelection();
  }
}

function updateKarteStationCenter(stationKm, absOption) {
  if (shouldSuppressMapSearchCenter()) return;
  if (!karteMap) return;

  const item = absOption || getSelectedAbsOption();
  if (!item) return;

  const aoa = item.aoa ? String(item.aoa) : '';
  if (!aoa || !karteAbschnittByAoa.size) return;

  const feature = karteAbschnittByAoa.get(aoa);
  if (!feature) return;

  const geometry = feature.getGeometry();
  if (!geometry || typeof geometry.getLength !== 'function') return;

  const lngMeters = Number(item.lng);
  if (!Number.isFinite(lngMeters) || lngMeters <= 0) return;

  const numericStationKm = Number.isFinite(Number(stationKm))
    ? Number(stationKm)
    : getCurrentStationValue();
  if (!Number.isFinite(numericStationKm)) return;

  const stationMeters = numericStationKm * 1000;
  if (!Number.isFinite(stationMeters)) return;

  const lineLength = geometry.getLength();
  if (!Number.isFinite(lineLength) || lineLength <= 0) return;

  const normalizedMeters = (stationMeters / lngMeters) * lineLength;
  const clampedMeters = Math.min(lineLength, Math.max(0, normalizedMeters));
  const fraction = clampedMeters / lineLength;

  const coordinate = getLineCoordinateAtFraction(geometry, fraction);
  if (!coordinate) return;

  const view = karteMap.getView();
  if (view) {
    const currentCenter = view.getCenter ? view.getCenter() : null;
    if (currentCenter && typeof karteMap.getPixelFromCoordinate === 'function') {
      const currentPx = karteMap.getPixelFromCoordinate(currentCenter);
      const targetPx = karteMap.getPixelFromCoordinate(coordinate);
      if (currentPx && targetPx) {
        const dx = currentPx[0] - targetPx[0];
        const dy = currentPx[1] - targetPx[1];
        if ((dx * dx + dy * dy) < 0.5) {
          return;
        }
      }
    }
    view.setCenter([coordinate[0], coordinate[1]]);
  }
}

function getStationSliderApis() {
  return Array.from(new Set([stationSliderTop, stationSlider].filter(Boolean)));
}

function getStationSliderEls(target = 'both') {
  const ids = [];
  if (target === 'top' || target === 'both') ids.push('stationSliderTop');
  if (target === 'bottom' || target === 'both') ids.push('stationSlider');

  return Array.from(
    new Set(
      ids
        .map(id => document.getElementById(id))
        .filter(Boolean)
    )
  );
}

function getPrimaryStationSlider() {
  return stationSlider || stationSliderTop;
}

function getCurrentStationValue() {
  const slider = getPrimaryStationSlider();
  if (!slider) return null;

  const raw = slider.get();
  const value = Array.isArray(raw) ? raw[0] : raw;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function syncSliderAvailability(slider) {
  if (!slider || !slider.options || !slider.options.range) return;

  const targetEl = slider.target || slider;
  const min = Number(slider.options.range.min);
  const max = Number(slider.options.range.max);
  const hasRange = Number.isFinite(min) && Number.isFinite(max) && max > min;

  if (targetEl && targetEl.classList) {
    targetEl.classList.toggle('stationSlider--zeroRange', !hasRange);
  }

  if (typeof slider.disable === 'function' && typeof slider.enable === 'function') {
    if (hasRange) {
      slider.enable();
    } else {
      slider.disable();
    }
  }
}

function updateStationSliderOptions(options, target = 'both') {
  const sliders = [];

  if (target === 'top' || target === 'both') {
    if (stationSliderTop) sliders.push(stationSliderTop);
  }
  if (target === 'bottom' || target === 'both') {
    if (stationSlider) sliders.push(stationSlider);
  }

  Array.from(new Set(sliders)).forEach((slider) => {
    slider.updateOptions(options, false);
    syncSliderAvailability(slider);
  });
}

function setStationSelectorsEnabled(enabled) {
  const isEnabled = !!enabled;
  const stationRow = document.querySelector('.stationRow');
  if (stationRow) {
    stationRow.classList.toggle('stationRow--disabled', !isEnabled);
  }

  const stationInput = stationRow
    ? stationRow.querySelector('.ts-number-input')
    : document.getElementById('stationInput');
  if (stationInput) {
    stationInput.disabled = !isEnabled;
    stationInput.setAttribute('aria-disabled', String(!isEnabled));
  }

  const sliderStack = stationRow ? stationRow.querySelector('.stationSliderStack') : null;
  if (sliderStack) {
    sliderStack.setAttribute('aria-disabled', String(!isEnabled));
  }

  getStationSliderApis().forEach((slider) => {
    if (typeof slider.disable !== 'function' || typeof slider.enable !== 'function') return;
    if (!isEnabled) {
      slider.disable();
    } else {
      syncSliderAvailability(slider);
    }
  });
}

function setStationValue(val, { source } = {}) {
  const sliders = getStationSliderApis();
  if (!sliders.length) {
    updateKilometerOutput(val);
    return;
  }

  suppressSliderUpdate = true;
  try {
    sliders.forEach((slider) => {
      if (source && slider === source) return;
      slider.set(val);
    });
  } finally {
    suppressSliderUpdate = false;
  }
}

function metersToKm(value) {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  return (num / 1000).toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
}

function metersToM(value) {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function formatKmThreeDecimals(valueKm) {
  if (valueKm === undefined || valueKm === null || valueKm === '') return '';
  const num = Number(valueKm);
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
}

function formatKmDisplay(valueKm, smallClass) {
  const formatted = formatKmThreeDecimals(valueKm);
  if (!formatted || !smallClass) return formatted;
  const parts = formatted.split(',');
  if (parts.length < 2) return formatted;
  const decimals = parts[1] || '';
  if (decimals.length < 2) return formatted;
  const big = `${parts[0]},${decimals.charAt(0)}`;
  const small = decimals.slice(1);
  return `${big}<span class="${smallClass}">${small}</span>`;
}

function formatKmOneDecimal(valueKm) {
  if (valueKm === undefined || valueKm === null || valueKm === '') return '';
  const num = Number(valueKm);
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}

function formatKmLabel(valueKm) {
  if (valueKm === undefined || valueKm === null || valueKm === '') return '';
  const num = Number(valueKm);
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function parseKilometerInput(value) {
  if (value === undefined || value === null) return null;
  let text = String(value).trim();
  if (!text) return null;
  text = text.replace(/\s+/g, '');
  const hasComma = text.includes(',');
  const hasDot = text.includes('.');
  if (hasComma && hasDot) {
    text = text.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    text = text.replace(',', '.');
  }
  const num = Number(text);
  return Number.isFinite(num) ? num : null;
}

function normalizeKilometerFilterInput({ commit = true } = {}) {
  if (!kilometerFilterInput) return;
  const rawValue = kilometerFilterInput.value;
  const hadInput = rawValue.trim() !== '';
  const parsed = parseKilometerInput(rawValue);
  if (!Number.isFinite(parsed)) {
    kilometerFilterInvalid = hadInput;
    if (commit) {
      kilometerFilterValue = null;
    }
    kilometerFilterInput.value = '';
    setKilometerFilterOutOfRange(false);
    if (hadInput) {
      setKilometerFilterMessage('Ungültig', 'invalid');
    } else if (kilometerFilterMessage && kilometerFilterMessage.dataset.state === 'invalid') {
      setKilometerFilterMessage('');
    }
    return;
  }
  kilometerFilterInvalid = false;
  if (kilometerFilterMessage && kilometerFilterMessage.dataset.state === 'invalid') {
    setKilometerFilterMessage('');
  }
  if (commit) {
    kilometerFilterValue = parsed;
  }
  kilometerFilterInput.value = formatKmThreeDecimals(parsed);
}

function getKilometerFilterValue() {
  return Number.isFinite(kilometerFilterValue) ? kilometerFilterValue : null;
}

function shouldFocusAbschnittSelect(kmValue) {
  if (!Number.isFinite(kmValue)) return false;
  const selected = getSelectedAbsOption();
  const options = absOptionsAll.filter(opt => matchesKilometerFilter(opt, kmValue));
  if (!options.length) return false;
  const matchesSelected = selected && matchesKilometerFilter(selected, kmValue);
  if (matchesSelected) {
    return options.length > 1;
  }
  return true;
}

function formatSignText(value) {
  if (value === undefined || value === null) return '';
  const text = String(value).trim();
  if (!text) return '';

  const match = text.match(/^(AS|AK)\b\s*/);
  if (!match) return text;

  const replacement = {
    AS: '',
    AK: 'Kreuz '
  }[match[1]];

  return `${replacement}${text.slice(match[0].length)}`.trim();
}

function renderBabEntry(data, escape, {
  outerClass = 'tblOption tblOption--bab',
  showArrow = true
} = {}) {
  const isAll = data.bab === BAB_ALL_VALUE;
  const badgeLabel = data.bdg || data.bab || '';
  const labelText = data.lbl || data.bab || '';
  const vasText = data.vas || '';
  const nasText = data.nas || '';

  const badgeHtml = isAll
    ? `
          <div class="babBadge babBadge--reset" aria-hidden="true">
            <svg class="babResetIcon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7a5 5 0 1 1-4.9 4H5.08A7 7 0 1 0 17.65 6.35z" fill="currentColor"/>
            </svg>
          </div>
        `
    : `
          <div class="babBadge">
            <div class="babLabel">${escape(badgeLabel)}</div>
          </div>
        `;

  const arrowHtml = (isAll || !showArrow)
    ? ''
    : '<div class="tblCell tblCell--dblArw">&#x21c4;</div>';

  return `
    <div class="${outerClass}">
      <div class="tblCell tblCell--babGrafix">
        <div class="babGrid">
          ${badgeHtml}
        </div>
      </div>
      <div class="tblCell tblCell--babLbl">${escape(labelText)}</div>
      <div class="tblCell tblCell--babVAS">${escape(vasText)}</div>
      ${arrowHtml}
      <div class="tblCell tblCell--babNAS">${escape(nasText)}</div>
    </div>
  `;
}

function renderAbsEntry(data, escape, {
  useBlueSign = true,
  outerClass = 'tblOption tblOption--abs'
} = {}) {
  const vktText = data.vkt !== '-' ? String(data.vkt) : '';
  const nktText = data.nkt !== '-' ? String(data.nkt) : '';

  const signType = (value) => {
    const match = String(value || '').match(/^(AS|AK|AD)\b/);
    return match ? match[1] : '';
  };

  const vasType = signType(data.vas);
  const nasType = signType(data.nas);

  const vasIconClass = useBlueSign
    ? (vasType === 'AS' ? 'asIcon'
      : (vasType === 'AK' || vasType === 'AD') ? 'akIcon'
      : null)
    : null;
  const nasIconClass = useBlueSign
    ? (nasType === 'AS' ? 'asIcon'
      : (nasType === 'AK' || nasType === 'AD') ? 'akIcon'
      : null)
    : null;

  const hasVasIcon = !!vasIconClass;
  const hasNasIcon = !!nasIconClass;
  const pillClass = 'knPill';

  const vktPillHtml = useBlueSign && hasVasIcon && vktText.trim()
    ? `<div class="${pillClass}">${escape(vktText)}</div>`
    : '';
  const nktPillHtml = useBlueSign && hasNasIcon && nktText.trim()
    ? `<div class="${pillClass}">${escape(nktText)}</div>`
    : '';

  const vasText = escape(formatSignText(data.vas));
  const nasText = escape(formatSignText(data.nas));

  const vasBlueSignClass = hasVasIcon ? 'blueSign' : 'blueSign blueSign--noIcon';
  const nasBlueSignClass = hasNasIcon ? 'blueSign' : 'blueSign blueSign--noIcon';

  const gapClass = data.bkmGapAbove ? 'bkmGap' : '';
  const gapHintHtml = (data.bkmGapAbove && Number.isFinite(data.deltaKm) && data.deltaKm !== 0)
    ? `<span class="bkmGapHint">&#x0394; ${metersToM(data.deltaKm)} m</span>`
    : '';

  const renderSignRow = (typeLabel, pillHtml, text, iconClass, blueSignClass) => {
    if (useBlueSign) {
      const iconHtml = iconClass ? `<div class="${iconClass}"></div>` : '';
      return `
        <div class="${blueSignClass}">
          <div class="blueSignContent">
            ${iconHtml}
            ${pillHtml}
            <div class="blueSignText">${text}</div>
          </div>
        </div>
      `;
    }

    const badgeHtml = typeLabel
      ? `<div class="signBadge">${escape(typeLabel)}</div>`
      : '';

    return `
      <div class="plainSignRow">
        ${badgeHtml}
        ${pillHtml}
        <div class="plainSignText">${text}</div>
      </div>
    `;
  };

  return `
    <div class="${outerClass} ${gapClass}">
      <div class="tblCell tblCell--absLbl">
        ${escape(data.abs)}
      </div>

      <div class="tblCell tblCell--fromAndTo">
        <div class="tblCell tblCell--fromRow">
          ${renderSignRow(vasType, vktPillHtml, vasText, vasIconClass, vasBlueSignClass)}
        </div>
        <div class="tblCell tblCell--toRow">
          ${renderSignRow(nasType, nktPillHtml, nasText, nasIconClass, nasBlueSignClass)}
        </div>
      </div>

      <div class="tblCell tblCell--AOA">
        <div class="tblCell tblCell--fromAOA">
          ${data.vnk}
        </div>
        <div class="tblCell tblCell--toAOA">
          ${data.nnk}
        </div>
      </div>

      <div class="tblCell tblCell--BKM">
        <div class="tblCell tblCell--fromBKM">
          <div class="bkmWrapper">
            <span>von</span>${metersToKm(data.vkm)} ${gapHintHtml}
          </div>
        </div>
        <div class="tblCell tblCell--toBKM">
          <div class="bkmWrapper">
            <span>bis</span>${metersToKm(data.nkm)}
          </div>
        </div>
      </div>

      <div class="tblCell tblCell--lngLbl">
        <div class="lngWrapper">
          ${metersToKm(data.lng)}<span>km</span>
        </div>
      </div>
    </div>
  `;
}

function renderAbsSelectedRow(data, escape) {
  const formatEndpoint = (name, kt) => {
    const base = String(name || '').trim();
    const ktText = kt !== undefined && kt !== null && String(kt).trim() !== '-'
      ? String(kt).trim()
      : '';
    if (!ktText) return base;
    return `${base} (${ktText})`;
  };
  const vasText = formatEndpoint(data.vas, data.vkt);
  const nasText = formatEndpoint(data.nas, data.nkt);
  return `
    <div class="absSelectedRow">
      <div class="absSelectedCell absSelectedCell--abs">ABS ${escape(data.abs)} ${escape(vasText)} → ${escape(nasText)} ● ${escape(data.vnk)}${escape(data.nnk)} ● KM ${metersToKm(data.vkm)} bis ${metersToKm(data.nkm)} ● ${metersToKm(data.lng)} km</div>
    </div>
  `;
}

function parseFpsData(raw) {
  if (!raw) return [];

  let fps = raw;
  if (typeof fps === 'string') {
    try {
      fps = JSON.parse(raw);
    } catch (err) {
      console.warn('FPS konnte nicht geparst werden:', raw, err);
      return [];
    }
  }

  if (!Array.isArray(fps)) return [];

  return fps
    .map((pair) => {
      if (!Array.isArray(pair) || pair.length < 2) return null;

      const localMeters = Number(pair[0]);
      const globalMeters = Number(pair[1]);
      if (!Number.isFinite(localMeters) || !Number.isFinite(globalMeters)) {
        return null;
      }

      return [localMeters, globalMeters];
    })
    .filter(Boolean);
}

function parseCpsData(raw) {
  if (!raw) return [];

  let cps = raw;
  if (typeof cps === 'string') {
    try {
      cps = JSON.parse(raw);
    } catch (err) {
      console.warn('CPS konnte nicht geparst werden:', raw, err);
      return [];
    }
  }

  if (!Array.isArray(cps)) return [];

  return cps
    .map((pair) => {
      if (!Array.isArray(pair) || pair.length < 2) return null;
      const localMeters = Number(pair[0]);
      const globalMeters = Number(pair[1]);
      if (!Number.isFinite(localMeters) || !Number.isFinite(globalMeters)) {
        return null;
      }
      return [localMeters, globalMeters];
    })
    .filter(Boolean);
}

function getSelectedAbsOption() {
  if (!absSelect) return null;

  const rawValue = absSelect.getValue();
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  if (!value) return null;

  return absSelect.options[value] || null;
}

function getSelectedBabOption() {
  if (!babSelect) return null;

  const rawValue = babSelect.getValue();
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  if (!value) return null;

  return babSelect.options[value] || null;
}

function getStationInputValue() {
  const input = document.getElementById('stationInput');
  if (!input) return null;
  const num = parseFloat(input.value);
  return Number.isFinite(num) ? num : null;
}

function setOutputValue(outputEl, value, { html = false } = {}) {
  if (!outputEl) return;
  const text = value === null || value === undefined ? '' : String(value);
  if (outputEl.tagName === 'INPUT' || outputEl.tagName === 'TEXTAREA') {
    outputEl.value = text;
  } else if (html) {
    outputEl.innerHTML = text;
  } else {
    outputEl.textContent = text;
  }
  if (outputEl.id) {
    syncCopyStateForTarget(outputEl.id);
  }
}


function updateBabOutput() {
  const item = getSelectedBabOption();
  if (item) {
    const text = item.bdg || item.bab || '';
    setOutputValue(babOutput, text);
    return;
  }

  const absItem = getSelectedAbsOption();
  const absBab = absItem && absItem.bab ? String(absItem.bab).trim() : '';
  if (!absBab) {
    setOutputValue(babOutput, '');
    return;
  }

  const babMatch = autobahnen.find(bab => bab && bab.bab === absBab);
  const text = babMatch ? (babMatch.bdg || babMatch.bab || '') : absBab;
  setOutputValue(babOutput, text);
}

function updateAbsOutput(stationKm) {
  const item = getSelectedAbsOption();
  const absText = item
    ? (item.abs !== undefined && item.abs !== null ? item.abs : item.label || '')
    : '';
  const blockText = item && item.blk !== undefined && item.blk !== null ? item.blk : '';
  const aoaText = item && item.aoa !== undefined && item.aoa !== null ? item.aoa : '';
  setOutputValue(absOutput, absText);
  setOutputValue(blockOutput, blockText);
  setOutputValue(aoaOutput, aoaText);
  updateRefOutput(stationKm);
  updateKarteOutputTilesVisibility();
}

function updateStationOutput(stationKm) {
  if (!getSelectedAbsOption()) {
    setOutputValue(stationOutput, '', { html: true });
    return;
  }
  let value = Number.isFinite(stationKm) ? stationKm : getCurrentStationValue();
  if (!Number.isFinite(value)) {
    value = getStationInputValue();
  }
  const text = Number.isFinite(value) ? formatKmDisplay(value, 'r5c3LastTwo') : '';
  setOutputValue(stationOutput, text, { html: true });
}

function updateRefOutput(stationKm) {
  if (!refOutput) return;
  const absItem = getSelectedAbsOption();
  if (!absItem) {
    setOutputValue(refOutput, '');
    updateKarteOutputTilesVisibility();
    return;
  }
  const babItem = getSelectedBabOption();
  let badgeRaw = babItem && babItem.bdg;
  if (!badgeRaw) {
    const absBab = absItem.bab ? String(absItem.bab).trim() : '';
    if (absBab) {
      const babMatch = autobahnen.find(bab => bab && bab.bab === absBab);
      badgeRaw = (babMatch && babMatch.bdg) || absBab;
    }
  }
  badgeRaw = badgeRaw || '';
  const badgeText = badgeRaw ? String(badgeRaw).trim() : '';
  const label = badgeText
    ? (badgeText.startsWith('A') ? badgeText : `A${badgeText}`)
    : '';
  const absValue = absItem.abs !== undefined && absItem.abs !== null ? absItem.abs : '';
  let value = Number.isFinite(stationKm) ? stationKm : getCurrentStationValue();
  if (!Number.isFinite(value)) {
    value = getStationInputValue();
  }
  const stationText = Number.isFinite(value) ? formatKmThreeDecimals(value) : '';
  const parts = [label, absValue, stationText].filter(part => String(part).trim() !== '');
  setOutputValue(refOutput, parts.join('_'));
  updateKarteOutputTilesVisibility();
}

function updateReferenzVisibility() {
  if (!referenzGraphic) return;
  let value = '';
  if (kilometerOutput) {
    if (kilometerOutput.tagName === 'INPUT' || kilometerOutput.tagName === 'TEXTAREA') {
      value = kilometerOutput.value || '';
    } else {
      value = kilometerOutput.textContent || '';
    }
  }
  const hasValue = value.trim() !== '';
  referenzGraphic.classList.toggle('is-empty', !hasValue);
}

function getOutputText(el) {
  if (!el) return '';
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    return el.value || '';
  }
  return el.textContent || '';
}

function updateKarteOutputTilesVisibility() {
  if (!karteOutputTiles) return;
  const stationText = getOutputText(kilometerOutput).trim();
  if (!stationText) {
    karteOutputTiles.classList.add('is-hidden');
    return;
  }
  const aoaText = getOutputText(aoaOutput).trim();
  const refText = getOutputText(refOutput).trim();
  const panText = getOutputText(panOutput).trim();
  const utmText = getOutputText(utmOutput).trim();
  const latLonText = getOutputText(latLonOutput).trim();
  const hasAny = aoaText !== '' || refText !== '' || panText !== '' || utmText !== '' || latLonText !== '';
  karteOutputTiles.classList.toggle('is-hidden', !hasAny);
}

function updateReferenceOutputs(stationKm) {
  updateBabOutput();
  updateAbsOutput(stationKm);
  updateStationOutput(stationKm);
  updateReferenzVisibility();
  updateKarteOutputTilesVisibility();
}

function resetKilometerOutput() {
  setOutputValue(kilometerOutput, '');
  updateReferenzVisibility();
}

function calcBkmFromCps(stationKm, cps) {
  if (!Array.isArray(cps) || !cps.length) return null;
  const stationMeters = Number(stationKm) * 1000;
  if (!Number.isFinite(stationMeters)) return null;

  let vonsta = -1;
  let vonbkm = -1;
  let bissta = -1;
  let bisbkm = -1;

  for (const [sta, bkm] of cps) {
    const staMeters = Number(sta);
    const bkmMeters = Number(bkm);
    if (!Number.isFinite(staMeters) || !Number.isFinite(bkmMeters)) continue;

    vonsta = staMeters;
    vonbkm = bkmMeters;

    if (stationMeters < staMeters) {
      vonsta = bissta;
      vonbkm = bisbkm;
      bissta = staMeters;
      bisbkm = bkmMeters;
      break;
    }

    bissta = staMeters;
    bisbkm = bkmMeters;
  }

  if (!Number.isFinite(vonsta) || !Number.isFinite(vonbkm)) {
    return null;
  }

  if (!Number.isFinite(bissta) || !Number.isFinite(bisbkm)) {
    bissta = vonsta;
    bisbkm = vonbkm;
  }

  const denominator = Math.abs(bissta - vonsta);
  const corfct = denominator > 0
    ? Math.abs(bisbkm - vonbkm) / denominator
    : 1;

  const meters = (vonbkm > bisbkm)
    ? vonbkm - ((stationMeters - vonsta) * corfct)
    : vonbkm + ((stationMeters - vonsta) * corfct);

  return Number.isFinite(meters) ? meters / 1000 : null;
}

function calcStationFromBkm(globalKm, cps) {
  if (!Array.isArray(cps) || !cps.length) return null;
  const globalMeters = Number(globalKm) * 1000;
  if (!Number.isFinite(globalMeters)) return null;

  let prevSta = null;
  let prevBkm = null;

  for (const [sta, bkm] of cps) {
    const staMeters = Number(sta);
    const bkmMeters = Number(bkm);
    if (!Number.isFinite(staMeters) || !Number.isFinite(bkmMeters)) continue;

    if (prevSta === null || prevBkm === null) {
      prevSta = staMeters;
      prevBkm = bkmMeters;
      if (Math.abs(globalMeters - bkmMeters) < 1e-6) {
        return staMeters / 1000;
      }
      continue;
    }

    const minBkm = Math.min(prevBkm, bkmMeters);
    const maxBkm = Math.max(prevBkm, bkmMeters);
    if (globalMeters < minBkm - 1e-6 || globalMeters > maxBkm + 1e-6) {
      prevSta = staMeters;
      prevBkm = bkmMeters;
      continue;
    }

    const denom = bkmMeters - prevBkm;
    if (Math.abs(denom) < 1e-9) return prevSta / 1000;

    const ratio = (globalMeters - prevBkm) / denom;
    const localMeters = prevSta + ratio * (staMeters - prevSta);
    return Number.isFinite(localMeters) ? localMeters / 1000 : null;
  }

  return null;
}

function calcBkm(stationKm) {
  const item = getSelectedAbsOption();
  if (!item) return null;

  const cps = parseCpsData(item.cps);
  return calcBkmFromCps(stationKm, cps);
}

function updateKilometerOutput(stationKm) {
  if (!kilometerOutput) return;
  if (!getSelectedAbsOption()) {
    setOutputValue(kilometerOutput, '');
    updateStationOutput();
    updateRefOutput();
    updateReferenzVisibility();
    updateKarteOutputTilesVisibility();
    updateKarteStationCenter();
    return;
  }

  const bkm = calcBkm(stationKm);
  const displayBkm = Number.isFinite(bkm) ? Math.round(bkm * 1000) / 1000 : bkm;
  const text = Number.isFinite(displayBkm) ? formatKmDisplay(displayBkm, 'bkmLastTwo') : '';
  setOutputValue(kilometerOutput, text, { html: true });
  updateStationOutput(stationKm);
  updateRefOutput(stationKm);
  updateReferenzVisibility();
  updateKarteOutputTilesVisibility();
  updateKarteStationCenter(stationKm);
  if (text && kilometerFilterClearOnReferenz) {
    kilometerFilterClearOnReferenz = false;
    deferKilometerFilterReset();
  }
}

function initCopyHelpers() {
  copyHelpers = new Map();

  const buttons = document.querySelectorAll('.outputCopyBtn[data-copy-target]');
  buttons.forEach((button) => {
    const targetId = button.getAttribute('data-copy-target');
    if (!targetId) return;
    const input = document.getElementById(targetId);
    if (!input) return;
    const statusId = button.getAttribute('data-copy-status');
    const status = statusId ? document.getElementById(statusId) : null;
    const helper = {
      button,
      input,
      status,
      wrap: button.closest('.outputCopyWrap'),
      tile: null,
      timer: null,
      clearTimer: null,
      lastValue: getCopySourceValue(input).trim(),
      isHovering: false,
      pendingClear: false
    };
    helper.tile = helper.wrap
      ? helper.wrap.closest('.bkmTafel, .blkTafel, .staTafel')
      : null;

    copyHelpers.set(targetId, helper);
    button.addEventListener('click', () => copyOutputValue(helper));
    if (helper.wrap) {
      helper.wrap.addEventListener('mouseenter', () => {
        helper.isHovering = true;
        helper.pendingClear = false;
      });
      helper.wrap.addEventListener('mouseleave', () => {
        helper.isHovering = false;
        helper.pendingClear = true;
        helper.wrap.classList.remove('is-copy-locked');
        maybeClearCopiedState(helper);
      });
    }
    syncCopyState(helper);
  });
}

function syncCopyStateForTarget(targetId) {
  const helper = copyHelpers.get(targetId);
  if (!helper) return;
  syncCopyState(helper);
}

function getCopySourceValue(source) {
  if (!source) return '';
  const tag = source.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') {
    return String(source.value || '');
  }
  return String(source.textContent || '');
}

function syncCopyState(helper) {
  const value = getCopySourceValue(helper.input).trim();
  const valueChanged = value !== helper.lastValue;
  const statusVisible = !!(helper.status && helper.status.classList.contains('is-visible'));
  if (valueChanged) {
    helper.lastValue = value;
    if (!statusVisible) {
      maybeClearCopiedState(helper, { force: true });
      if (helper.status) {
        helper.status.textContent = '';
        helper.status.classList.remove('is-visible', 'is-error', 'is-success', 'is-success-tick');
        helper.status.style.removeProperty('width');
        helper.status.style.removeProperty('height');
      }
    }
  }
  const hasValue = value.length > 0;
  helper.button.disabled = !hasValue;
  helper.button.setAttribute('aria-disabled', String(!hasValue));

  if (!hasValue && helper.status && !statusVisible) {
    helper.status.textContent = '';
    helper.status.classList.remove('is-visible', 'is-error', 'is-success', 'is-success-tick');
    helper.status.style.removeProperty('width');
    helper.status.style.removeProperty('height');
    maybeClearCopiedState(helper, { force: true });
  }
}

function copyOutputValue(helper) {
  if (!helper.input) return;
  if (helper.wrap) {
    helper.wrap.classList.add('is-copied');
    helper.wrap.classList.add('is-copy-locked');
  }
  if (helper.button) {
    helper.button.classList.add('is-copied');
  }
  const value = getCopySourceValue(helper.input).trim();
  if (!value) {
    showCopyStatus(helper, 'Kein Wert', true);
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(value)
      .then(() => showCopyStatus(helper, 'Kopiert'))
      .catch(() => {
        const ok = fallbackCopy(helper, value);
        showCopyStatus(helper, ok ? 'Kopiert' : 'Kopieren fehlgeschlagen', !ok);
      });
    return;
  }

  const ok = fallbackCopy(helper, value);
  showCopyStatus(helper, ok ? 'Kopiert' : 'Kopieren fehlgeschlagen', !ok);
}

function fallbackCopy(helper, value) {
  if (!helper.input) return false;
  const text = typeof value === 'string' ? value : getCopySourceValue(helper.input).trim();
  if (!text) return false;

  const active = document.activeElement;
  const isInput = helper.input.tagName === 'INPUT' || helper.input.tagName === 'TEXTAREA';
  let target = helper.input;
  let temp = null;

  if (!isInput) {
    temp = document.createElement('textarea');
    temp.value = text;
    temp.setAttribute('readonly', '');
    temp.style.position = 'absolute';
    temp.style.left = '-9999px';
    temp.style.top = '0';
    document.body.appendChild(temp);
    target = temp;
  }

  target.focus();
  target.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (err) {
    ok = false;
  }

  if (temp && temp.parentNode) {
    temp.parentNode.removeChild(temp);
  }

  if (active && typeof active.focus === 'function') {
    active.focus();
  }

  const selection = window.getSelection ? window.getSelection() : null;
  if (selection && selection.removeAllRanges) {
    selection.removeAllRanges();
  }

  return ok;
}

function showCopyStatus(helper, message, isError = false) {
  if (!helper.status) return;
  helper.status.textContent = message;
  helper.status.classList.toggle('is-error', !!isError);
  const isSuccess = !isError && message === 'Kopiert';
  helper.status.classList.toggle('is-success', isSuccess);
  const isTick = isSuccess && helper.input && copySuccessTickTargets.has(helper.input.id);
  helper.status.classList.toggle('is-success-tick', isTick);
  helper.status.classList.add('is-visible');
  syncCopyStatusWidth(helper, isSuccess);
  if (helper.tile) {
    helper.tile.classList.toggle('is-copy-active', isSuccess);
  }
  if (helper.wrap) {
    helper.wrap.classList.toggle('has-copy-badge', isSuccess);
  }
  if (helper.button) {
    if (!isError && message === 'Kopiert') {
      helper.button.classList.add('is-copied');
      if (helper.wrap) {
        helper.wrap.classList.add('is-copied');
      }
    } else {
      helper.button.classList.remove('is-copied');
      if (helper.wrap) {
        helper.wrap.classList.remove('is-copied');
      }
    }
  }

  if (helper.timer) {
    clearTimeout(helper.timer);
  }
  if (helper.clearTimer) {
    clearTimeout(helper.clearTimer);
  }

  helper.timer = setTimeout(() => {
    if (!helper.status) return;
    helper.status.classList.remove('is-visible');
    helper.clearTimer = setTimeout(() => {
      if (!helper.status) return;
      helper.status.classList.remove('is-error', 'is-success', 'is-success-tick');
      helper.status.textContent = '';
      helper.status.style.removeProperty('width');
      helper.status.style.removeProperty('height');
      if (helper.tile) {
        helper.tile.classList.remove('is-copy-active');
      }
      if (helper.wrap) {
        helper.wrap.classList.remove('has-copy-badge');
      }
      maybeClearCopiedState(helper);
    }, COPY_STATUS_FADE_MS);
  }, COPY_STATUS_DURATION_MS);
}

function syncCopyStatusWidth(helper, isSuccess) {
  if (!helper || !helper.status) return;
  if (!isSuccess || !helper.input) {
    helper.status.style.removeProperty('width');
    return;
  }
  helper.status.style.removeProperty('width');
  helper.status.style.removeProperty('height');
  const valueRect = helper.input.getBoundingClientRect();
  const statusRect = helper.status.getBoundingClientRect();
  const horizontalPad = 6;
  const verticalPad = 6;
  const targetHeight = Math.max(valueRect.height + verticalPad, statusRect.height);
  const targetWidth = Math.max(valueRect.width + horizontalPad, statusRect.width);
  if (Number.isFinite(targetWidth) && targetWidth > 0) {
    helper.status.style.width = `${Math.ceil(targetWidth)}px`;
  }
  if (Number.isFinite(targetHeight) && targetHeight > 0) {
    helper.status.style.height = `${Math.ceil(targetHeight)}px`;
  }
}

function maybeClearCopiedState(helper, { force = false } = {}) {
  if (!helper || !helper.button) return;
  if (!force && helper.status && helper.status.classList.contains('is-visible')) return;
  if (!force && !helper.pendingClear) return;
  helper.button.classList.remove('is-copied');
  if (helper.wrap) {
    helper.wrap.classList.remove('is-copied');
  }
  helper.pendingClear = false;
}

function buildLocalStationPips(lngMeters) {
  const lng = Number(lngMeters);
  if (!Number.isFinite(lng) || lng <= 0) return null;

  const maxKm = lng / 1000;
  const labelStepKm = maxKm >= 0.5 ? 0.5 : 0.1;
  const pipStepMeters = 100; // 100 m granularity for station pips
  const epsilon = 1e-4;
  const metaLookup = new Map();
  const values = [];

  const isOnStep = (kmValue, stepKm) => {
    const remainder = Math.abs(kmValue % stepKm);
    return remainder < epsilon || Math.abs(remainder - stepKm) < epsilon;
  };

  const addPip = (kmValue) => {
    const clamped = Math.min(kmValue, maxKm);
    const key = clamped.toFixed(3);

    const isFullKm = isOnStep(clamped, 1);
    const isLabeledStep = isOnStep(clamped, labelStepKm);
    const kind = isFullKm ? 'full' : isLabeledStep ? 'half' : 'extra';

    if (metaLookup.has(key)) {
      const existing = metaLookup.get(key);
      if (existing === 'full' || (existing === 'half' && kind === 'extra')) {
        return;
      }
    }

    metaLookup.set(key, kind);
    values.push(clamped);
  };

  addPip(0);
  for (let meters = pipStepMeters; meters <= lng + 0.5; meters += pipStepMeters) {
    addPip(meters / 1000);
  }

  const uniqueValues = Array.from(new Set(values)).sort((a, b) => a - b);

  return {
    mode: 'values',
    values: uniqueValues,
    density: 1000,
    format: {
      to: (value) => {
        const key = Number(value).toFixed(3);
        const kind = metaLookup.get(key);
        if (kind === 'full') return formatKmLabel(value);
        if (kind === 'half') return formatKmOneDecimal(value);
        return '';
      },
      from: Number
    },
    filter: (value) => {
      const key = Number(value).toFixed(3);
      const kind = metaLookup.get(key);
      if (kind === 'full') return 1;
      if (kind === 'half') return 2;
      if (kind === 'extra') return 2;
      return -1; // drop any auto-added pips not described in meta
    },
    meta: Object.fromEntries(metaLookup)
  };
}

function buildFpsPips(rawFps, rawCps, lngMeters) {
  const lng = Number(lngMeters);
  if (!Number.isFinite(lng) || lng <= 0) return null;

  const fps = parseFpsData(rawFps);
  if (!fps.length) return null;

  const maxKm = lng / 1000;
  const cps = parseCpsData(rawCps);
  const firstGlobalKm = cps[0] && Number(cps[0][1]) / 1000;
  const lastGlobalKm = cps[cps.length - 1] && Number(cps[cps.length - 1][1]) / 1000;
  const extremes = (Number.isFinite(firstGlobalKm) && Number.isFinite(lastGlobalKm))
    ? { startGlobalKm: firstGlobalKm, endGlobalKm: lastGlobalKm }
    : null;

  const hasHalfKilometerStep = fps.some(([, globalMeters]) => {
    const globalKm = globalMeters / 1000;
    if (!Number.isFinite(globalKm)) return false;

    const epsilon = 1e-4;
    const doubled = globalKm * 2; // half-km multiples -> integer after doubling
    return Math.abs(doubled - Math.round(doubled)) < epsilon;
  });

  const pipStepKm = hasHalfKilometerStep ? 0.5 : 0.1;
  const isOnStep = (kmValue) => {
    const remainder = Math.abs(kmValue % pipStepKm);
    const epsilon = 1e-4;
    return remainder < epsilon || Math.abs(remainder - pipStepKm) < epsilon;
  };

  const snapLocalToOutput = (localKm, targetKm) => {
    if (!Number.isFinite(localKm) || !Number.isFinite(targetKm)) return null;
    const step = 0.001;
    const base = Math.round(localKm / step) * step;
    const candidates = [
      base,
      Math.floor(localKm / step) * step,
      Math.ceil(localKm / step) * step
    ];
    const targetRounded = Math.round(targetKm * 1000);
    let best = null;
    let bestDiff = Infinity;
    let matched = false;

    candidates.forEach((candidate) => {
      const bkm = calcBkmFromCps(candidate, cps);
      if (!Number.isFinite(bkm)) return;
      const diff = Math.abs(bkm - targetKm);
      const matches = Math.round(bkm * 1000) === targetRounded;
      if (matches) {
        if (!matched || diff < bestDiff) {
          best = candidate;
          bestDiff = diff;
          matched = true;
        }
      } else if (!matched && diff < bestDiff) {
        best = candidate;
        bestDiff = diff;
      }
    });

    return best;
  };

  const pipLookup = new Map();

  fps.forEach(([localMeters, globalMeters]) => {
    const globalKm = globalMeters / 1000;
    if (!Number.isFinite(globalKm)) return;

    const localFromBkm = calcStationFromBkm(globalKm, cps);
    const alignedLocalKm = Number.isFinite(localFromBkm)
      ? snapLocalToOutput(localFromBkm, globalKm)
      : null;
    const fallbackLocalKm = Number(localMeters) / 1000;
    const localKm = Number.isFinite(alignedLocalKm)
      ? alignedLocalKm
      : Number.isFinite(localFromBkm) ? localFromBkm : fallbackLocalKm;
    if (!Number.isFinite(localKm) || localKm < 0) return;

    const normalizedLocalKm = Math.min(localKm, maxKm);
    const key = normalizedLocalKm.toFixed(3);

    if (!pipLookup.has(key)) {
      pipLookup.set(key, { labelKm: globalKm, stepKm: globalKm });
    }
  });

  if (!pipLookup.size) return null;

  const filteredEntries = Array.from(pipLookup.entries())
    .map(([localKey, data]) => ({
      local: Number(localKey),
      stepKm: data.stepKm,
      labelKm: data.labelKm
    }))
    .sort((a, b) => a.local - b.local);

  const labelEntries = filteredEntries.filter(({ stepKm }) => isOnStep(stepKm));
  const extraEntries = filteredEntries.filter(({ local, stepKm }) => {
    if (local === 0) return false; // skip zero marker
    return !isOnStep(stepKm);
  });

  const combinedEntries = labelEntries.concat(extraEntries).sort((a, b) => a.local - b.local);
  const labelKeys = new Set(labelEntries.map(entry => entry.local.toFixed(3)));

  const metaLookup = new Map();
  const snapKmToHalf = (kmValue) => {
    if (!Number.isFinite(kmValue)) return null;
    return Math.round(kmValue * 2) / 2;
  };
  const isWholeKm = (kmValue) => {
    if (!Number.isFinite(kmValue)) return false;
    return Math.abs(kmValue - Math.round(kmValue)) < 1e-6;
  };

  labelEntries.forEach(({ local, labelKm, stepKm }) => {
    const key = local.toFixed(3);
    const displayKm = snapKmToHalf(Number.isFinite(labelKm) ? labelKm : stepKm);
    metaLookup.set(key, isWholeKm(displayKm) ? 'full' : 'half');
  });
  extraEntries.forEach(({ local }) => {
    const key = local.toFixed(3);
    metaLookup.set(key, 'extra');
  });

  const values = combinedEntries.map(entry => entry.local);

  return {
    mode: 'values',
    values,
    density: 1000, // large density avoids autogenerated sub-pips
    format: {
      to: (value) => {
        const key = Number(value).toFixed(3);
        if (!labelKeys.has(key)) return '';
        const entry = pipLookup.get(key);
        if (!entry) return key;
        const baseKm = Number.isFinite(entry.labelKm) ? entry.labelKm : entry.stepKm;
        const displayKm = snapKmToHalf(baseKm);
        if (!Number.isFinite(displayKm)) return key;
        return isWholeKm(displayKm) ? formatKmLabel(displayKm) : formatKmOneDecimal(displayKm);
      },
      from: Number
    },
    filter: (value) => {
      const key = Number(value).toFixed(3);
      // Suppress the auto-added zero/min pip unless it's explicitly part of the data
      if (Math.abs(Number(key)) < 1e-6 && !metaLookup.has(key)) {
        return -1; // PipsType.None
      }
      const kind = metaLookup.get(key);
      if (kind === 'full') return 1;   // large marker + label
      if (kind === 'half') return 2;   // small marker + label
      if (kind === 'extra') return 2;  // smallest marker, no label (class added later)
      return -1; // drop any auto-added pips not described in meta
    },
    meta: Object.fromEntries(metaLookup),
    extremes
  };
}

function initTomSelects() {
  buildAbsOptionsIndex();

  const babOptions = [...autobahnen];

  // BAB select – now rendered in table-style
  babSelect = new TomSelect('#babSelect', {
    maxItems: 1,
    options: babOptions,
    valueField: 'bab',   // A7, A8O, A93N, ...
    labelField: 'lbl',   // "A7", "A8 Ost", ...
    searchField: ['bab', 'lbl', 'vkt', 'vas', 'nkt', 'nas'],
    sortField: [{ field: '$order', direction: 'asc' }],
    placeholder: 'Autobahn',
    maxOptions: null,
    render: {
      no_results: () => '<div class="no-results">Keine Suchergebnisse</div>',
      option: (data, escape) => {
        return renderBabEntry(data, escape);
      }
    }
  });
  updateBabResetOptionAvailability();

  // ABS select (global options grouped by BAB)
  absSelect = new TomSelect('#absSelect', {
    maxItems: 1,
    options: [],
    optgroups: absOptgroupsAll,
    optgroupField: 'bab',
    lockOptgroupOrder: true,
    valueField: 'id',
    labelField: 'label', // "Abschnitt 470" etc. as selected text
    searchField: ['label', 'aoa', 'vkt', 'vnk', 'vas', 'nkt', 'nnk', 'nas', 'von', 'bis'],
    placeholder: 'Abschnitt',
    maxOptions: null,
    render: {
      no_results: () => '<div class="no-results">Keine Suchergebnisse</div>',
      optgroup_header: (data, escape) => {
        return renderBabEntry(data, escape, {
          outerClass: 'tblOption tblOption--bab tblOption--babGroup'
        });
      },
      option: (data, escape) => {
        return renderAbsEntry(data, escape, {
          useBlueSign: true,
          outerClass: 'tblOption tblOption--abs'
        });
      },
      item: (data, escape) => {
        return renderAbsSelectedRow(data, escape);
      }
    },
    onDropdownClose: () => {
      if (!kilometerFilterClearOnClose) return;
      kilometerFilterClearOnClose = false;
      deferKilometerFilterReset();
    },
    onType: () => {
      const hasFilterValue = Number.isFinite(getKilometerFilterValue());
      const hasFilterInput = kilometerFilterInput && kilometerFilterInput.value.trim() !== '';
      if (!hasFilterValue && !hasFilterInput) return;
      applyAbschnittFilter({ forceOpen: true });
    }
  });

  absOptionsAll = absOptionsGlobal;
  applyAbschnittFilter({ resetSelection: true });

  setKilometerFilterEnabled(!!babSelect.getValue());
  setAbsSelectorEnabled(absOptionsAll.length > 0);

  // connect them
  wireBabToAbs();
  updateReferenceOutputs();
}

function updateBabResetOptionAvailability() {
  if (!babSelect) return;
  const hasSelection = !!babSelect.getValue();
  const hasResetOption = Object.prototype.hasOwnProperty.call(babSelect.options, BAB_ALL_VALUE);

  if (hasSelection && !hasResetOption) {
    babSelect.addOption({ ...BAB_RESET_OPTION });
  } else if (!hasSelection && hasResetOption) {
    babSelect.removeOption(BAB_ALL_VALUE);
  }

  babSelect.refreshOptions(false);
}

function initKilometerFilter() {
  kilometerFilterInput = document.getElementById('kilometerFilter');
  kilometerFilterApplyBtn = document.getElementById('kilometerFilterApply');
  kilometerFilterMessage = document.getElementById('kilometerFilterMessage');
  kilometerFilterMessageText = document.getElementById('kilometerFilterMessageText');
  kilometerFilterMessageBtn = document.getElementById('kilometerFilterMessageBtn');
  if (!kilometerFilterInput || !kilometerFilterApplyBtn) return;

  setKilometerFilterEnabled(false);

  kilometerFilterApplyBtn.addEventListener('click', () => {
    kilometerFilterAutoConfirm = false;
    normalizeKilometerFilterInput();
    if (kilometerFilterInvalid) return;
    const kmValue = getKilometerFilterValue();
    applyAbschnittFilter({ forceOpen: true, syncStation: true });
    if (shouldFocusAbschnittSelect(kmValue)) {
      focusAbschnittSelect();
    }
  });

  kilometerFilterInput.addEventListener('input', (event) => {
    const inputType = event && event.inputType;
    if (inputType === 'insertReplacementText' ||
        inputType === 'insertFromAutoFill' ||
        inputType === 'insertFromAutocomplete') {
      kilometerFilterAutoConfirm = true;
    }
  });

  kilometerFilterInput.addEventListener('change', () => {
    if (kilometerFilterAutoConfirm) {
      kilometerFilterAutoConfirm = false;
      normalizeKilometerFilterInput();
      if (kilometerFilterInvalid) return;
      const kmValue = getKilometerFilterValue();
      applyAbschnittFilter({ forceOpen: true, syncStation: true });
      if (shouldFocusAbschnittSelect(kmValue)) {
        focusAbschnittSelect();
      }
      return;
    }
    const hadFilterValue = Number.isFinite(kilometerFilterValue);
    normalizeKilometerFilterInput({ commit: false });
    const hasInvalidMessage = kilometerFilterMessage && kilometerFilterMessage.dataset.state === 'invalid';
    const hasInput = kilometerFilterInput.value.trim() !== '';
    if (!hasInput) {
      if (hadFilterValue) {
        resetKilometerFilterValue();
        applyAbschnittFilter();
        if (hasInvalidMessage) {
          setKilometerFilterMessage('Ungültiger Kilometer', 'invalid');
        }
      } else {
        if (!hasInvalidMessage) {
          setKilometerFilterOutOfRange(false);
        }
      }
    }
  });

  kilometerFilterInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (kilometerFilterMessage && kilometerFilterMessage.classList.contains('is-visible')) {
      resetKilometerFilterValue();
      applyAbschnittFilter();
      return;
    }
    kilometerFilterApplyBtn.click();
  });

  if (kilometerFilterMessageBtn) {
    kilometerFilterMessageBtn.addEventListener('click', () => {
      resetKilometerFilterValue();
      applyAbschnittFilter();
      if (kilometerFilterInput && !kilometerFilterInput.disabled) {
        kilometerFilterInput.focus();
      }
    });
  }
}

function initReferenzOverlayPlacement() {
  const overlay = referenzOverlay || document.querySelector('.referenzOverlay');
  const mapBlock = document.querySelector('.block--karte');
  if (!overlay || !mapBlock) return;

  if (overlay.parentElement !== mapBlock) {
    mapBlock.appendChild(overlay);
  }
}

function resetKilometerFilterValue() {
  if (!kilometerFilterInput) return;
  kilometerFilterInput.value = '';
  kilometerFilterValue = null;
  kilometerFilterInvalid = false;
  kilometerFilterClearOnReferenz = false;
  kilometerFilterClearOnClose = false;
  setKilometerFilterMessage('');
  setKilometerFilterOutOfRange(false);
}

function deferKilometerFilterReset() {
  if (kilometerFilterResetPending) return;
  if (!Number.isFinite(kilometerFilterValue)) return;
  kilometerFilterResetPending = true;
  // Let the referenz outputs update before rebuilding options.
  setTimeout(() => {
    kilometerFilterResetPending = false;
    if (!Number.isFinite(kilometerFilterValue)) return;
    resetKilometerFilterValue();
    applyAbschnittFilter();
  }, 0);
}

function clearKilometerFilterOnStationInput() {
  if (!kilometerFilterInput) return;
  const hasInput = kilometerFilterInput.value.trim() !== '';
  const hasValue = Number.isFinite(kilometerFilterValue);
  if (!hasInput && !hasValue) return;
  resetKilometerFilterValue();
  applyAbschnittFilter();
}

function setKilometerFilterEnabled(enabled) {
  if (!kilometerFilterInput || !kilometerFilterApplyBtn) return;
  const isEnabled = !!enabled;
  kilometerFilterInput.disabled = !isEnabled;
  kilometerFilterApplyBtn.disabled = !isEnabled;
  const field = kilometerFilterInput.closest('.kilometerFilterField');
  if (field) {
    field.classList.toggle('is-disabled', !isEnabled);
  }
  const label = document.querySelector('.kilometerFilterLabel');
  if (label) {
    label.classList.toggle('is-disabled', !isEnabled);
  }
  if (!isEnabled) {
    resetKilometerFilterValue();
    setKilometerFilterOutOfRange(false);
  }
}

function setAbsSelectorEnabled(enabled) {
  if (!absSelect) return;
  const isEnabled = !!enabled;
  if (typeof absSelect.enable === 'function' && typeof absSelect.disable === 'function') {
    if (isEnabled) {
      absSelect.enable();
    } else {
      absSelect.disable();
    }
  }
  if (absSelect.wrapper) {
    absSelect.wrapper.setAttribute('aria-disabled', String(!isEnabled));
  }
}

function setKilometerFilterOutOfRange(isOutOfRange) {
  if (!kilometerFilterInput) return;
  const field = kilometerFilterInput.closest('.kilometerFilterField');
  if (!field) return;
  field.classList.toggle('is-out-of-range', !!isOutOfRange);
}

function setKilometerFilterMessage(message = '', state = '') {
  if (!kilometerFilterMessage) return;
  const hasMessage = !!message;
  if (kilometerFilterMessageText) {
    kilometerFilterMessageText.textContent = message;
  } else {
    kilometerFilterMessage.textContent = message;
  }
  kilometerFilterMessage.classList.toggle('is-visible', hasMessage);
  if (state) {
    kilometerFilterMessage.dataset.state = state;
  } else {
    kilometerFilterMessage.removeAttribute('data-state');
  }
}

function matchesKilometerFilter(option, kmValue) {
  if (!Number.isFinite(kmValue)) return true;
  const start = Number.isFinite(option.vkmMeters) ? option.vkmMeters : Number(option.vkm);
  const end = Number.isFinite(option.nkmMeters) ? option.nkmMeters : Number(option.nkm);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  const kmMeters = kmValue * 1000;
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  return kmMeters >= min && kmMeters <= max;
}

function applyAbschnittFilter({ forceOpen = false, resetSelection = false, syncStation = false } = {}) {
  if (!absSelect) return;

  const kmValue = getKilometerFilterValue();
  const hasFilter = Number.isFinite(kmValue);
  const selectedRaw = resetSelection ? null : absSelect.getValue();
  const selected = Array.isArray(selectedRaw) ? selectedRaw[0] : selectedRaw;
  const hadSelection = !!selected;
  const options = hasFilter
    ? absOptionsAll.filter(opt => matchesKilometerFilter(opt, kmValue))
    : absOptionsAll;

  const isOutOfRange = hasFilter && options.length === 0;
  setKilometerFilterOutOfRange(isOutOfRange);
  if (isOutOfRange) {
    setKilometerFilterMessage('Nicht im Bereich', 'range');
  } else if (kilometerFilterMessage && kilometerFilterMessage.dataset.state === 'range') {
    setKilometerFilterMessage('');
  }

  absSelect.clear(true);
  absSelect.clearOptions();
  options.forEach(opt => absSelect.addOption(opt));
  absSelect.refreshOptions(false);

  const selectedOption = selected
    ? options.find(opt => opt.id === selected)
    : null;
  if (selectedOption) {
    absSelect.setValue(selected, true);
  } else if (hadSelection) {
    resetStationState();
  }

  if ((forceOpen || hasFilter) && options.length > 0 && (!selectedOption || options.length > 1)) {
    absSelect.open();
  }

  if (syncStation && hasFilter && selectedOption) {
    kilometerFilterClearOnReferenz = options.length === 1;
    kilometerFilterClearOnClose = options.length > 1;
    setStationFromKilometer(selectedOption, kmValue);
  }

  updateAbsOutput();
}

function setStationFromKilometer(absOption, globalKm) {
  if (!absOption || !Number.isFinite(globalKm)) return;
  const cps = parseCpsData(absOption.cps);
  const localKm = calcStationFromBkm(globalKm, cps);
  if (!Number.isFinite(localKm)) return;

  const lngMeters = Number(absOption.lng);
  const maxKm = Number.isFinite(lngMeters) ? Math.max(0, lngMeters / 1000) : null;
  const clamped = Number.isFinite(maxKm)
    ? Math.min(Math.max(0, localKm), maxKm)
    : localKm;

  const stationContainer = document.querySelector('.stationRow .ts-number');
  const input = stationContainer
    ? stationContainer.querySelector('.ts-number-input')
    : null;

  if (input) {
    input.value = clamped.toFixed(3);
    const ev = new Event('change', { bubbles: true });
    input.dispatchEvent(ev);
  } else {
    setStationValue(clamped);
  }
}

function resetStationState() {
  const stationContainer = document.querySelector('.stationRow .ts-number');
  if (stationContainer) {
    const input = stationContainer.querySelector('.ts-number-input');
    if (input) {
      stationContainer.setAttribute('data-min', '0');
      stationContainer.setAttribute('data-max', '');
      input.min = '0';
      input.max = '';
      input.value = '0.000';
      const ev = new Event('change', { bubbles: true });
      input.dispatchEvent(ev);
    }
  }

  if (getStationSliderApis().length) {
    updateStationSliderOptions({
      range: { min: 0, max: 0 },
      step: 0.001,
      start: 0,
      pips: null
    });

    updateActivePipMarker(getCurrentStationValue());
  }

  renderExtremeLabels(null);
  decoratePips(null);
  setSliderHasPips(false);
  renderLocalBounds(null);
  resetKilometerOutput();
  updateStationOutput();
  setStationSelectorsEnabled(false);
}

function focusStationStepper() {
  const stationInput = document.querySelector('.stationRow .ts-number-input');
  if (!stationInput) return;

  const focusInput = () => {
    try {
      stationInput.focus({ preventScroll: true });
    } catch (err) {
      stationInput.focus();
    }
  };

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(focusInput);
  } else {
    setTimeout(focusInput, 0);
  }
}

function focusAbschnittSelect() {
  if (absSelect && typeof absSelect.focus === 'function') {
    absSelect.focus();
    return;
  }
  const selectEl = document.getElementById('absSelect');
  if (selectEl) selectEl.focus();
}

function buildAbsOptionsForBab(bab) {
  if (!bab) return [];
  const abschnitte = bab.abschnitte || [];

  const absOptions = [];
  let prevToBkm = null;
  let prevNNK = null;

  abschnitte.forEach(a => {
    const vkmMeters = Number(a.vkm);
    const nkmMeters = Number(a.nkm);
    const prevMeters = Number(prevToBkm);
    const fromNK = String(a.vnk);
    const prevNK = String(prevNNK);
    const hasPrev = prevToBkm !== '' && prevToBkm !== null && Number.isFinite(prevMeters);
    const hasFrom = a.vkm !== '' && a.vkm !== null && Number.isFinite(vkmMeters);
    const bkmGapAbove = hasPrev && hasFrom && vkmMeters !== prevMeters && fromNK === prevNK;
    const deltaKm = Math.abs(vkmMeters - prevMeters);

    absOptions.push({
      id: `${bab.bab}-${a.abs}`,
      label: `Abschnitt ${a.abs}`,
      bab: bab.bab,
      babLabel: bab.lbl,
      ...a,
      vkmMeters,
      nkmMeters,
      bkmGapAbove,
      deltaKm
    });

    prevToBkm = a.nkm;
    prevNNK = a.nnk;
  });

  return absOptions;
}

function getAbsOptionsForBabValue(babValue) {
  if (!babValue) return absOptionsGlobal;
  const key = String(babValue).trim();
  if (!key) return absOptionsGlobal;
  return absOptionsByBab.get(key) || absOptionsGlobal;
}

function buildAbsOptionsIndex() {
  absOptionsByAoa = new Map();
  absOptionsByBab = new Map();
  absOptionsGlobal = [];
  absOptgroupsAll = [];
  if (!autobahnen || !autobahnen.length) return;

  autobahnen.forEach((bab, index) => {
    const options = buildAbsOptionsForBab(bab);
    const babKey = bab && bab.bab ? String(bab.bab).trim() : '';
    if (babKey) {
      const babLabel = bab && (bab.lbl || bab.bab) ? String(bab.lbl || bab.bab).trim() : babKey;
      absOptionsByBab.set(babKey, options);
      absOptgroupsAll.push({
        value: babKey,
        label: babLabel,
        bab: babKey,
        bdg: bab && bab.bdg ? String(bab.bdg).trim() : babKey,
        lbl: babLabel,
        vkt: bab && bab.vkt ? String(bab.vkt).trim() : '',
        vas: bab && bab.vas ? String(bab.vas).trim() : '',
        nkt: bab && bab.nkt ? String(bab.nkt).trim() : '',
        nas: bab && bab.nas ? String(bab.nas).trim() : '',
        $order: index + 1
      });
    }
    absOptionsGlobal.push(...options);
    options.forEach((option) => {
      const aoa = option.aoa ? String(option.aoa) : '';
      if (!aoa) return;
      absOptionsByAoa.set(aoa, option);
    });
  });

  if (karteAbschnittLayer && typeof karteAbschnittLayer.changed === 'function') {
    karteAbschnittLayer.changed();
  }

  if (INITIAL_BAB_FIT && !karteInitialBabFitted) {
    fitMapToBabExtent(INITIAL_BAB_FIT);
  }
}

function wireBabToAbs() {
  babSelect.on('change', (babValue) => {
    if (suppressBabChange) return;
    if (babValue === BAB_ALL_VALUE) {
      suppressBabChange = true;
      babSelect.clear(true);
      updateBabResetOptionAvailability();
      suppressBabChange = false;
      babValue = '';
      absOptionsAll = absOptionsGlobal;
      setKilometerFilterEnabled(false);
      setAbsSelectorEnabled(absOptionsAll.length > 0);
      applyAbschnittFilter({ resetSelection: true });
      resetStationState();
      updateKarteAbschnitt(null);
      resetKarteViewToDefault();
      updateReferenceOutputs();
      return;
    }
    const hasBab = !!babValue;
    updateBabResetOptionAvailability();
    setKilometerFilterEnabled(hasBab);
    if (hasBab) {
      resetKilometerFilterValue();
    }
    absOptionsAll = getAbsOptionsForBabValue(babValue);
    setAbsSelectorEnabled(absOptionsAll.length > 0);
    applyAbschnittFilter({ resetSelection: false });
    const selectedAbs = getSelectedAbsOption();
    if (!selectedAbs) {
      resetStationState();
    }
    updateKarteAbschnitt(selectedAbs);
    updateReferenceOutputs();
  });

  absSelect.on('change', (absId) => {
    const prevAbsId = lastAbschnittId;
    lastAbschnittId = absId || null;

    resetKilometerOutput();
    updateAbsOutput();
    const item = absSelect.options[absId];
    const isMapSearchSelection = karteSearchSelectingAbschnitt
      && Number.isFinite(karteSearchPendingStationKm);
    if (item && babSelect && item.bab && babSelect.getValue() !== item.bab) {
      babSelect.setValue(item.bab);
    }
    updateKarteAbschnitt(item);
    if (!item) {
      resetStationState();
      return;
    }
    setStationSelectorsEnabled(true);
    focusStationStepper();
    console.log('Ausgewählter Abschnitt:', item);
    if (absId && Number.isFinite(kilometerFilterValue)) {
      kilometerFilterClearOnReferenz = true;
    }
    kilometerFilterClearOnClose = false;

    const stationContainer = document.querySelector('.stationRow .ts-number');
    const input = stationContainer
      ? stationContainer.querySelector('.ts-number-input')
      : null;

    const lngMeters = Number(item.lng);
    if (!Number.isFinite(lngMeters) || lngMeters <= 0) {
      const maxStr = '0.000';

      if (stationContainer && input) {
        stationContainer.setAttribute('data-min', '0');
        stationContainer.setAttribute('data-max', maxStr);
        stationContainer.setAttribute('data-step', '0.001');

        input.min = '0';
        input.max = maxStr;
        input.step = '0.001';
        if (!isMapSearchSelection) {
          input.value = '0.000';

          const ev = new Event('change', { bubbles: true });
          input.dispatchEvent(ev);
        }
      }

      if (getStationSliderApis().length) {
        updateStationSliderOptions({
          range: { min: 0, max: 0 },
          step: 0.001,
          start: 0,
          pips: null
        });

        updateActivePipMarker(getCurrentStationValue());
      }

      renderExtremeLabels(null);
      decoratePips(null);
      setSliderHasPips(false);
      renderLocalBounds(null);
      resetKilometerOutput();
      return;
    }

    const maxKm = lngMeters / 1000;
    const maxStr = maxKm.toFixed(3);
    renderLocalBounds({ min: 0, max: maxKm });

    // Local station range: 0…lng (km)
    if (stationContainer && input) {
      stationContainer.setAttribute('data-min', '0');
      stationContainer.setAttribute('data-max', maxStr);
      stationContainer.setAttribute('data-step', '0.001');

      input.min = '0';
      input.max = maxStr;
      input.step = '0.001';
      if (!isMapSearchSelection) {
        input.value = '0.000';

        const ev = new Event('change', { bubbles: true });
        input.dispatchEvent(ev);
      }
    }

    const globalPips = buildFpsPips(item.fps, item.cps, lngMeters);
    const localPips = buildLocalStationPips(lngMeters);
    const hasGlobalPips = !!(globalPips && globalPips.values && globalPips.values.length);
    const hasLocalPips = !!(localPips && localPips.values && localPips.values.length);
    const sliderHasPips = hasGlobalPips || hasLocalPips;

    setSliderHasPips(sliderHasPips);
    renderExtremeLabels(hasGlobalPips ? globalPips.extremes : null);

    if (getStationSliderApis().length) {
      const baseOptions = {
        range: { min: 0, max: maxKm },
        step: 0.001,
        start: 0
      };

      if (stationSliderTop) {
        updateStationSliderOptions({
          ...baseOptions,
          pips: localPips || null
        }, 'top');
      }

      if (stationSlider && stationSlider !== stationSliderTop) {
        updateStationSliderOptions({
          ...baseOptions,
          pips: globalPips || null
        }, 'bottom');
      } else if (!stationSliderTop && stationSlider) {
        updateStationSliderOptions({
          ...baseOptions,
          pips: globalPips || null
        }, 'bottom');
      }

      updateActivePipMarker(getCurrentStationValue());

      decoratePips(hasLocalPips ? localPips.meta : null, { target: 'top' });
      decoratePips(hasGlobalPips ? globalPips.meta : null, { target: 'bottom' });
    }

    if (!isMapSearchSelection) {
      const filterKm = getKilometerFilterValue();
      if (Number.isFinite(filterKm)) {
        setStationFromKilometer(item, filterKm);
      } else {
        updateKilometerOutput(getCurrentStationValue());
      }
    }
  });
}

/* ========= Numeric input helpers ========= */
function initTsNumberInputs() {
  const containers = document.querySelectorAll('.ts-number');

  containers.forEach((container) => {
    const input = container.querySelector('.ts-number-input');
    if (!input) return;
    if (container.hasAttribute('data-static') || container.hasAttribute('data-no-sync')) return;
    const isStationInput = !!container.closest('.stationRow');
    const stepperButtons = container.querySelectorAll('.ts-number-stepper-btn');

    const parseMaybe = (val) => {
      const num = parseFloat(val);
      return Number.isFinite(num) ? num : null;
    };

    const getMin = () => {
      return parseMaybe(input.min) ??
             parseMaybe(container.getAttribute('data-min')) ??
             0;
    };

    const getMax = () => {
      return parseMaybe(input.max) ??
             parseMaybe(container.getAttribute('data-max'));
    };

    const clamp = (val) => {
      const min = getMin();
      const max = getMax();
      if (min !== null) val = Math.max(val, min);
      if (max !== null) val = Math.min(val, max);
      return val;
    };

    const getStep = () => {
      return parseMaybe(input.step) ??
             parseMaybe(container.getAttribute('data-step')) ??
             1;
    };

    const getStepPrecision = (step) => {
      const stepString = String(step);
      if (stepString.includes('e-')) {
        const exp = Number(stepString.split('e-')[1]);
        return Number.isFinite(exp) ? exp : 0;
      }
      const parts = stepString.split('.');
      return parts[1] ? parts[1].length : 0;
    };

    const roundToPrecision = (val, precision) => {
      if (!Number.isFinite(precision) || precision <= 0) return Math.round(val);
      const factor = 10 ** precision;
      return Math.round(val * factor) / factor;
    };

    const syncSliders = (val) => {
      setStationValue(val);
    };

    const normalizeAndSync = () => {
      let val = parseFloat(input.value);
      if (!Number.isFinite(val)) {
        if (input.value === '' || input.value === null) return;
        val = getMin();
      }
      val = clamp(val);
      input.value = val.toFixed(3);
      syncSliders(val);
    };

    // Keep slider in sync while stepping with the native spinner or keyboard
    input.addEventListener('input', () => {
      if (isStationInput) {
        clearKilometerFilterOnStationInput();
      }
      const val = parseFloat(input.value);
      if (!Number.isFinite(val)) return;
      syncSliders(clamp(val));
    });

    input.addEventListener('keydown', (event) => {
      if (!isStationInput) return;
      if (['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(event.key)) return;
    });

    // Clamp & fix decimals on commit (blur/enter)
    input.addEventListener('change', () => {
      normalizeAndSync();
    });

    if (stepperButtons.length) {
      const syncStepperDisabled = () => {
        stepperButtons.forEach((btn) => {
          btn.disabled = input.disabled;
          btn.setAttribute('aria-disabled', String(input.disabled));
        });
      };

      const applyStep = (direction) => {
        if (input.disabled) return;
        const step = getStep();
        const precision = getStepPrecision(step);
        let val = parseFloat(input.value);
        if (!Number.isFinite(val)) {
          val = getMin();
          if (!Number.isFinite(val)) val = 0;
        }
        const next = clamp(roundToPrecision(val + (direction * step), precision));
        input.value = Number.isFinite(precision) ? next.toFixed(precision) : String(next);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        if (document.activeElement !== input) {
          input.focus({ preventScroll: true });
        }
      };

      stepperButtons.forEach((btn) => {
        const isUp = btn.classList.contains('ts-number-stepper-btn--up');
        const direction = isUp ? 1 : -1;
        btn.addEventListener('click', () => applyStep(direction));
      });

      syncStepperDisabled();
      const observer = new MutationObserver(syncStepperDisabled);
      observer.observe(input, { attributes: true, attributeFilter: ['disabled'] });
    }
  });
}

function setSliderHasPips(enabled) {
  const sliderEls = getStationSliderEls();
  const stationRow = sliderEls.length ? sliderEls[0].closest('.stationRow') : null;

  sliderEls.forEach((el) => {
    el.classList.toggle('stationSlider--hasPips', !!enabled);
  });

  if (stationRow) {
    stationRow.classList.toggle('stationRow--hasPips', !!enabled);
  }
}

function decoratePips(pipMeta, { target = 'both' } = {}) {
  const sliderEls = getStationSliderEls(target);
  if (!sliderEls.length) return;

  const metaMap = pipMeta ? new Map(Object.entries(pipMeta)) : new Map();

  sliderEls.forEach((sliderEl) => {
    const sliderApi = sliderEl.noUiSlider;
    const sliderMax = sliderApi && sliderApi.options && sliderApi.options.range
      ? sliderApi.options.range.max
      : null;
    const sliderMaxKey = Number.isFinite(sliderMax) ? Number(sliderMax).toFixed(3) : null;
    const isMirror = sliderEl.classList.contains('stationSlider--mirror');
    const markers = sliderEl.querySelectorAll('.noUi-marker');
    const values = sliderEl.querySelectorAll('.noUi-value[data-value]');

    markers.forEach(marker => {
      marker.classList.remove('pipFull', 'pipHalf', 'pipExtra');
    });
    values.forEach(val => {
      val.classList.remove('pipFullLabel', 'pipHalfLabel');
    });

    // Remove any zero-position pip/label only when not in meta (i.e., not from FPS)
    Array.from(values).forEach((valueEl) => {
      const key = Number(valueEl.getAttribute('data-value')).toFixed(3);
      const isZeroWithoutMeta = Math.abs(Number(key)) < 1e-6 && !metaMap.has(key);
      const isMirrorMaxWithoutMeta = isMirror &&
        sliderMaxKey !== null &&
        Math.abs(Number(key) - Number(sliderMaxKey)) < 1e-6 &&
        !metaMap.has(key);

      if (isZeroWithoutMeta || isMirrorMaxWithoutMeta || (isMirror && !metaMap.has(key))) {
        const markerEl = valueEl.previousElementSibling;
        if (markerEl && markerEl.classList.contains('noUi-marker')) {
          markerEl.remove();
        }
        valueEl.remove();
      }
    });

    Array.from(sliderEl.querySelectorAll('.noUi-value[data-value]')).forEach((valueEl) => {
      const markerEl = valueEl.previousElementSibling;
      if (!markerEl || !markerEl.classList.contains('noUi-marker')) return;

      const key = Number(valueEl.getAttribute('data-value')).toFixed(3);
      const kind = metaMap.get(key);

      if (kind === 'full') {
        markerEl.classList.add('pipFull');
        valueEl.classList.add('pipFullLabel');
      } else if (kind === 'half') {
        markerEl.classList.add('pipHalf');
        valueEl.classList.add('pipHalfLabel');
      } else if (kind === 'extra') {
        markerEl.classList.add('pipExtra');
      }
    });

    if (isMirror) {
      // On the mirror slider:
      // - only pips that have metadata (metaMap)
      // - at most ONE pip per data-value
      // - no stray bare markers without a value
      const seenKeys = new Set();

      Array.from(sliderEl.querySelectorAll('.noUi-marker')).forEach((markerEl) => {
        const valueEl = markerEl.nextElementSibling;

        // No label / data-value → not a logical pip → remove
        if (
          !valueEl ||
          !valueEl.classList.contains('noUi-value') ||
          !valueEl.hasAttribute('data-value')
        ) {
          markerEl.remove();
          return;
        }

        const key = Number(valueEl.getAttribute('data-value')).toFixed(3);

        // If this value has no meta, drop it
        if (!metaMap.has(key)) {
          valueEl.remove();
          markerEl.remove();
          return;
        }

        // If already seen this value, this is a duplicate pip (e.g. auto-added)
        if (seenKeys.has(key)) {
          valueEl.remove();
          markerEl.remove();
          return;
        }

        // First pip for this value – keep it
        seenKeys.add(key);
      });
    }
  });
}

function renderSliderBounds(sliderId, boundsClass, min, max) {
  const sliderEl = document.getElementById(sliderId);
  if (!sliderEl) return;

  const minNum = Number(min);
  const maxNum = Number(max);
  const hasBounds = Number.isFinite(minNum) && Number.isFinite(maxNum);

  let container = sliderEl.querySelector(`.${boundsClass}`);

  if (!hasBounds) {
    if (container) container.remove();
    return;
  }

  if (!container) {
    container = document.createElement('div');
    container.className = `stationSliderBounds ${boundsClass}`;
    container.innerHTML = `
      <span class="stationSliderBound stationSliderBound--min"></span>
      <span class="stationSliderBound stationSliderBound--arrow" aria-hidden="true"></span>
      <span class="stationSliderBound stationSliderBound--max"></span>
    `;
    sliderEl.appendChild(container);
  }

  const minEl = container.querySelector('.stationSliderBound--min');
  const maxEl = container.querySelector('.stationSliderBound--max');
  const arrowEl = container.querySelector('.stationSliderBound--arrow');
  const minText = formatKmThreeDecimals(minNum);
  const maxText = formatKmThreeDecimals(maxNum);
  const isAscending = maxNum >= minNum;
  const labelText = boundsClass.includes('local')
    ? 'Station'
    : boundsClass.includes('global')
      ? 'Kilometer'
      : '';

  const pipeLeft = '<span class="stationSliderBoundPipe stationSliderBoundPipe--left" aria-hidden="true"></span>';
  const pipeRight = '<span class="stationSliderBoundPipe stationSliderBoundPipe--right" aria-hidden="true"></span>';
  const minTextHtml = `<span class="stationSliderBoundText stationSliderBoundText--min">${minText || ''}</span>`;
  const maxTextHtml = `<span class="stationSliderBoundText stationSliderBoundText--max">${maxText || ''}</span>`;

  if (minEl) minEl.innerHTML = `${pipeLeft}${minTextHtml}`;
  if (maxEl) maxEl.innerHTML = `${maxTextHtml}${pipeRight}`;
  if (arrowEl) {
    arrowEl.textContent = '';
    arrowEl.setAttribute('data-direction', isAscending ? 'right' : 'left');
    arrowEl.setAttribute('aria-label', isAscending ? 'increasing to max' : 'decreasing to min');
    let labelEl = arrowEl.querySelector('.stationSliderBound--label');
    if (!labelEl) {
      labelEl = document.createElement('span');
      labelEl.className = 'stationSliderBound--label';
      arrowEl.appendChild(labelEl);
    }
    labelEl.textContent = labelText;
    labelEl.style.display = labelText ? 'block' : 'none';
  }

  // Dynamically inset the arrow so it starts/ends just inside the labels
  const updateArrowInset = () => {
    const labelMargin = 8; // keep a small gap between label text and arrow line
    const minWidth = minEl ? minEl.offsetWidth : 0;
    const maxWidth = maxEl ? maxEl.offsetWidth : 0;
    const minInset = Math.max(minWidth + labelMargin, labelMargin);
    const maxInset = Math.max(maxWidth + labelMargin, labelMargin);
    container.style.setProperty('--slider-arrow-inset-left', `${minInset}px`);
    container.style.setProperty('--slider-arrow-inset-right', `${maxInset}px`);
  };

  updateArrowInset();
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(updateArrowInset);
  }
}

function renderLocalBounds(bounds) {
  const min = bounds ? bounds.min : null;
  const max = bounds ? bounds.max : null;
  if (!Number.isFinite(max) || max <= 0) {
    renderSliderBounds('stationSliderTop', 'stationSliderBounds--local', null, null);
    return;
  }

  renderSliderBounds('stationSliderTop', 'stationSliderBounds--local', Number(min), Number(max));
}

function renderGlobalBounds(extremes) {
  const min = extremes ? extremes.startGlobalKm : null;
  const max = extremes ? extremes.endGlobalKm : null;
  renderSliderBounds('stationSlider', 'stationSliderBounds--global', min, max);
}

function renderExtremeLabels(extremes) {
  const sliderEl = document.getElementById('stationSlider');
  if (!sliderEl) return;

  renderGlobalBounds(extremes);

  const existing = sliderEl.querySelector('.stationSliderExtremes');
  if (existing) {
    existing.remove();
  }

  if (!extremes || !Number.isFinite(extremes.startGlobalKm) || !Number.isFinite(extremes.endGlobalKm)) {
    return;
  }

  const container = document.createElement('div');
  container.className = 'stationSliderExtremes';

  const startEl = document.createElement('div');
  startEl.className = 'stationSliderExtreme stationSliderExtreme--start';
  startEl.textContent = formatKmThreeDecimals(extremes.startGlobalKm);

  const endEl = document.createElement('div');
  endEl.className = 'stationSliderExtreme stationSliderExtreme--end';
  endEl.textContent = formatKmThreeDecimals(extremes.endGlobalKm);

  container.appendChild(startEl);
  container.appendChild(endEl);
  sliderEl.appendChild(container);
}

function normalizeStationValue(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(3) : null;
}

function updateActivePipMarker(value) {
  const sliderEls = getStationSliderEls();
  if (!sliderEls.length) return;

  const selected = normalizeStationValue(value);

  sliderEls.forEach((sliderEl) => {
    const pipValues = sliderEl.querySelectorAll('.noUi-value[data-value]');

    pipValues.forEach((pipValueEl) => {
      const markerEl = pipValueEl.previousElementSibling;
      if (!markerEl || !markerEl.classList.contains('noUi-marker')) return;

      const pipVal = normalizeStationValue(pipValueEl.getAttribute('data-value'));
      const isActive = !!selected && !!pipVal && pipVal === selected;

      markerEl.classList.toggle('noUi-marker--active', isActive);
      pipValueEl.classList.toggle('noUi-value--active', isActive);
    });
  });

  layoutPipLabels();
}

function layoutPipLabels() {
  const sliderEls = getStationSliderEls();
  if (!sliderEls.length) return;

  const minGapPx = 6;

  sliderEls.forEach((sliderEl) => {
    const pipValues = Array.from(sliderEl.querySelectorAll('.noUi-value[data-value]'));
    if (!pipValues.length) return;

    const items = pipValues
      .map(el => ({ el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => a.rect.left - b.rect.left);

    items.forEach(({ el }) => {
      el.classList.remove('noUi-value--row1', 'noUi-value--row2');
    });

    let lastRightRow1 = -Infinity;
    let lastRightRow2 = -Infinity;

    items.forEach(({ el, rect }) => {
      const overlapsRow1 = rect.left < (lastRightRow1 + minGapPx);
      if (overlapsRow1) {
        // Only move to row2 if row1 would collide; row1 stays default otherwise
        el.classList.add('noUi-value--row2');
        lastRightRow2 = Math.max(lastRightRow2, rect.right);
      } else {
        el.classList.add('noUi-value--row1');
        lastRightRow1 = Math.max(lastRightRow1, rect.right);
      }
    });
  });
}

function getPrimarySliderGeometry() {
  const slider = getPrimaryStationSlider();
  if (!slider || !slider.options || !slider.options.range) return null;

  const min = Number(slider.options.range.min);
  const max = Number(slider.options.range.max);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;

  const sliderEls = getStationSliderEls();
  const sliderEl = sliderEls.find(el => el.noUiSlider === slider) || slider.target || sliderEls[0];
  const baseEl = sliderEl ? sliderEl.querySelector('.noUi-base') : null;
  const rectSource = baseEl || sliderEl;
  const rect = rectSource ? rectSource.getBoundingClientRect() : null;

  if (!rect || rect.width <= 0) return null;

  return { slider, min, max, rect };
}

function updateHandleBarPosition(value) {
  const sliderStack = document.querySelector('.stationSliderStack');
  const handleBar = sliderStack ? sliderStack.querySelector('.stationSliderHandleBar') : null;
  if (!sliderStack || !handleBar) return;

  const geometry = getPrimarySliderGeometry();
  if (!geometry || geometry.min === geometry.max) return;

  const span = geometry.max - geometry.min;
  const sliderWidth = geometry.rect && geometry.rect.width;

  if (!Number.isFinite(span) || span <= 0 || !Number.isFinite(sliderWidth) || sliderWidth <= 0) {
    return;
  }

  const numericVal = Number.isFinite(Number(value)) ? Number(value) : getCurrentStationValue();
  if (!Number.isFinite(numericVal)) return;

  const clamped = Math.min(geometry.max, Math.max(geometry.min, numericVal));
  const ratio = Math.min(1, Math.max(0, (clamped - geometry.min) / span));
  const offsetPx = ratio * sliderWidth;

  sliderStack.style.setProperty('--slider-handle-left', `${offsetPx}px`);
}

function handleGuidePointer(evt) {
  if (typeof evt.button === 'number' && evt.button !== 0) return;

  const geometry = getPrimarySliderGeometry();
  if (!geometry) return;

  const ratio = (evt.clientX - geometry.rect.left) / geometry.rect.width;
  const clampedRatio = Math.min(1, Math.max(0, ratio));
  const span = geometry.max - geometry.min;
  const value = geometry.min + clampedRatio * span;

  clearKilometerFilterOnStationInput();
  evt.preventDefault();
  geometry.slider.set(value);
}

function initStationSliders() {
  if (!window.noUiSlider) return;

  const sliderEls = getStationSliderEls();
  if (!sliderEls.length) return;

  sliderEls.forEach((sliderEl) => {
    noUiSlider.create(sliderEl, {
      start: 0,
      step: 0.001,
      connect: [true, false],
      animate: false,
      animationDuration: 0,
      range: {
        min: 0,
        max: 0              // will be updated when Abschnitt is selected
      },
      format: {
        to: (value) => Number(value).toFixed(3),
        from: (value) => Number(value)
      }
    });
  });

  const topEl = document.getElementById('stationSliderTop');
  const bottomEl = document.getElementById('stationSlider');

  stationSliderTop = topEl ? topEl.noUiSlider : null;
  stationSlider = bottomEl ? bottomEl.noUiSlider : null;

  if (!stationSlider && stationSliderTop) {
    stationSlider = stationSliderTop;
  }

  getStationSliderApis().forEach(syncSliderAvailability);

  const stationInput = document.querySelector('.stationRow .ts-number-input');
  if (!stationInput) return;

  const bindSlider = (sliderInstance) => {
    sliderInstance.on('start', () => {
      stationSliderActive = true;
    });
    sliderInstance.on('end', () => {
      stationSliderActive = false;
    });
    sliderInstance.on('update', (values, handle) => {
      const val = values[handle]; // string with 3 decimals
      const numericVal = Number(val);

      if (!suppressSliderUpdate) {
        stationInput.value = val;
        setStationValue(val, { source: sliderInstance });
      }

      updateActivePipMarker(numericVal);
      updateHandleBarPosition(numericVal);
      updateKilometerOutput(numericVal);
    });
  };

  getStationSliderApis().forEach(bindSlider);

  updateHandleBarPosition(getCurrentStationValue());

  // Input → Slider sync is still handled in initTsNumberInputs()

  const sliderStack = document.querySelector('.stationSliderStack');
  if (sliderStack) {
    sliderStack.tabIndex = -1; // allow programmatic focus without adding to tab order
    sliderStack.addEventListener('pointerdown', (evt) => {
      const targetHandle = evt.target && evt.target.closest('.noUi-handle');
      if (targetHandle) {
        clearKilometerFilterOnStationInput();
        return; // keep handle focus behavior intact
      }

      const isJumpTarget = evt.target && evt.target.closest('.stationSliderGuide, .stationSliderBounds, .noUi-pips, .noUi-value, .noUi-marker');
      if (isJumpTarget) {
        handleGuidePointer(evt);
      }

      sliderStack.focus({ preventScroll: true });
    });

    sliderStack.addEventListener('keydown', (evt) => {
      const targetHandle = evt.target && evt.target.closest('.noUi-handle');
      if (!targetHandle) return;
    });
  }

  window.addEventListener('resize', () => {
    updateHandleBarPosition(getCurrentStationValue());
  });
}

function initStationFocusSync() {
  const stationRow = document.querySelector('.stationRow');
  if (!stationRow) return;

  const updateFocusState = () => {
    const isActive = stationRow.contains(document.activeElement);
    stationRow.classList.toggle('stationRow--focus', isActive);
  };

  stationRow.addEventListener('focusin', updateFocusState);
  stationRow.addEventListener('focusout', () => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(updateFocusState);
    } else {
      setTimeout(updateFocusState, 0);
    }
  });
}
