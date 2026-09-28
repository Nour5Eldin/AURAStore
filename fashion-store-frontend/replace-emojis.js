const fs = require('fs');
const path = require('path');

const replacements = [
  // TS and Component Inputs (replace emoji with just the icon name)
  { regex: /icon\s*=\s*["']📦["']/g, replace: 'icon="inventory_2"' },
  { regex: /icon\s*=\s*["']💰["']/g, replace: 'icon="attach_money"' },
  { regex: /icon\s*=\s*["']👥["']/g, replace: 'icon="people"' },
  { regex: /icon\s*=\s*["']⚠️["']/g, replace: 'icon="warning"' },
  { regex: /icon\s*=\s*["']💬["']/g, replace: 'icon="chat"' },
  { regex: /icon\s*=\s*["']👕["']/g, replace: 'icon="checkroom"' },
  { regex: /icon\s*=\s*["']📈["']/g, replace: 'icon="trending_up"' },
  { regex: /icon\s*=\s*["']😕["']/g, replace: 'icon="sentiment_dissatisfied"' },
  { regex: /icon\s*=\s*["']🔍["']/g, replace: 'icon="search"' },
  { regex: /emptyIcon\s*=\s*["']📋["']/g, replace: 'emptyIcon="assignment"' },

  // Sidebar TS icons (just names)
  { regex: /icon:\s*["']📊["']/g, replace: 'icon: "bar_chart"' },
  { regex: /icon:\s*["']👕["']/g, replace: 'icon: "checkroom"' },
  { regex: /icon:\s*["']📂["']/g, replace: 'icon: "folder"' },
  { regex: /icon:\s*["']📦["']/g, replace: 'icon: "inventory_2"' },
  { regex: /icon:\s*["']💬["']/g, replace: 'icon: "chat"' },
  { regex: /icon:\s*["']🖥️["']/g, replace: 'icon: "desktop_mac"' },
  { regex: /icon:\s*["']🔍["']/g, replace: 'icon: "search"' },
  { regex: /icon:\s*["']📈["']/g, replace: 'icon: "trending_up"' },
  { regex: /icon:\s*["']💰["']/g, replace: 'icon: "attach_money"' },

  // HTML inline text emojis (wrapped in span)
  { regex: /🙈/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">visibility_off</span>' },
  { regex: /👁️/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">visibility</span>' },
  { regex: /★/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;line-height:1;">star</span>' },
  { regex: /🚪/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">logout</span>' },
  { regex: /⚠️/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">warning</span>' },
  { regex: /✏️/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">edit</span>' },
  { regex: /🗑️/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">delete</span>' },
  { regex: /🗑/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">delete</span>' },
  { regex: /🖥️/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">desktop_mac</span>' },
  { regex: /📢/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">campaign</span>' },
  { regex: /➕/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">add</span>' },
  { regex: /🔗/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">link</span>' },
  { regex: /📁/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">folder_open</span>' },
  { regex: /💾/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">save</span>' },
  { regex: /✓/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">check</span>' },
  { regex: /✗/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">close</span>' },
  { regex: /🕐/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">schedule</span>' },
  { regex: /✕/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">close</span>' },
  { regex: /💵/g, replace: '<span class="material-icons" style="font-size:inherit;vertical-align:middle;">payments</span>' },
];

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.html') || full.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      let modified = false;
      for (const r of replacements) {
        if (r.regex.test(content)) {
          content = content.replace(r.regex, r.replace);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Updated: ${full}`);
      }
    }
  }
};
walk('src/app');
