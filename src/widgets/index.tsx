import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerWidget('pronouncify', WidgetLocation.SelectedTextMenu, {
    dimensions: {
      height: 'auto',
      width: '100%',
    },
    widgetTabTitle: 'pronouncify',
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
