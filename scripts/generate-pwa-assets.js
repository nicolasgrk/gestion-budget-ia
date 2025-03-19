const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDirectory = path.join(process.cwd(), 'public', 'icons');

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(iconDirectory)) {
  fs.mkdirSync(iconDirectory, { recursive: true });
}

async function generateIcons() {
  try {
    // Utiliser une image source (à remplacer par votre logo)
    const sourceImage = path.join(process.cwd(), 'public', 'logo.png');

    for (const size of sizes) {
      await sharp(sourceImage)
        .resize(size, size)
        .toFile(path.join(iconDirectory, `icon-${size}x${size}.png`));
      
      console.log(`✓ Généré icon-${size}x${size}.png`);
    }

    console.log('✨ Génération des icônes terminée !');
  } catch (error) {
    console.error('Erreur lors de la génération des icônes:', error);
  }
}

generateIcons(); 