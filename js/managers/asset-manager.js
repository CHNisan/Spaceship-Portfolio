// Returns promise that resolves when all assets are loaded
export async function preloadAssets() {
    PIXI.Assets.addBundle('images', {
        GMTKGameJamScreenShot: '/assets/images/GMTK 2020 Game Jam Screenshot.png',
        COVIDSimScreenShot: '/assets/images/COVID-19 Sim Cover.png',
      });

    PIXI.Assets.addBundle('videos', {
        TestVideo: '/assets/videos/Epic The Musical - Dangerous Animatic.mp4',
      });
    
    try {
        // Try loading all assets, throw an error if they cannot be loaded
        console.log('Preloading assets');
        await PIXI.Assets.loadBundle('images');
        await PIXI.Assets.loadBundle('videos');
        console.log('All assets loaded successfully');
    } catch (error) {
        console.error('Error loading assets:', error);
    }
}