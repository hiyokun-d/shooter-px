class Resources {
  toLoad: any;
  images: { [key: string]: { image: HTMLImageElement; isLoaded: boolean } };

  constructor() {
    this.toLoad = {
      map: "/map4.png"
      // Add more resources here if needed
    };

    this.images = {};

    // Array to store promises for each resource loading
    const promises: Promise<void>[] = [];

    Object.keys(this.toLoad).forEach((key) => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false,
      };

      // Create a promise for each resource loading
      const promise = new Promise<void>((resolve) => {
        img.onload = () => {
          this.images[key].isLoaded = true;
          resolve();
        };
      });

      promises.push(promise);
    });

    // Return a promise that resolves when all resources are loaded
    this.toLoadPromise = Promise.all(promises);
  }

  // Method to check if all resources are loaded
  isLoaded() {
    return Object.values(this.images).every((image) => image.isLoaded);
  }
}

export const resources = new Resources();
