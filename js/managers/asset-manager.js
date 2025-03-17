// Returns promise that resolves when all assets are loaded
export async function preloadAssets() {
    PIXI.Assets.addBundle('images', {
        GMTKGameJamScreenShot: '/assets/images/GMTK 2020 Game Jam Screenshot.png',
        COVIDSimScreenShot: '/assets/images/COVID-19 Sim Cover.png',
      });
    
    await PIXI.Assets.loadBundle('images');

    PIXI.Assets.addBundle('videos', {
        TestGif: '/assets/videos/Test gif.gif',
      });
    
    await PIXI.Assets.loadBundle('videos');
    
    try {
        // Try loading all assets, throw an error if they cannot be loaded
        console.log('Preloading assets');
        await PIXI.Assets.loadBundle('sprites');
        console.log('All assets loaded successfully');
    } catch (error) {
        console.error('Error loading assets:', error);
    }
}