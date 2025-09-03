// Unit tests for cache manager
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DOMTestUtils, APITestUtils } from './test-utils.js';
import CacheManager from '../modules/cacheManager.js';

describe('CacheManager', () => {
  beforeEach(() => {
    // Reset localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: DOMTestUtils.mockLocalStorage(),
      writable: true
    });

    // Reset sessionStorage mock
    Object.defineProperty(window, 'sessionStorage', {
      value: DOMTestUtils.mockLocalStorage(),
      writable: true
    });
  });

  describe('Session Management', () => {
    it('should detect new session when no session ID exists', () => {
      expect(CacheManager.isNewSession()).toBe(true);
    });

    it('should not detect new session when session ID exists', () => {
      sessionStorage.setItem('dashboardSession', '12345');
      expect(CacheManager.isNewSession()).toBe(false);
    });
  });

  describe('Cache Operations', () => {
    it('should store and retrieve cached data', () => {
      const testData = { test: 'data' };
      CacheManager.setCache('testKey', testData);
      
      const retrieved = CacheManager.getCache('testKey');
      expect(retrieved.data).toEqual(testData);
      expect(retrieved.timestamp).toBeDefined();
    });

    it('should return null for non-existent cache', () => {
      const result = CacheManager.getCache('nonExistent');
      expect(result).toBeNull();
    });
  });

  describe('Weather Cache', () => {
    it('should cache and retrieve weather data', () => {
      const weatherData = APITestUtils.mockSuccessfulWeatherResponse();
      CacheManager.setCachedWeather(weatherData);
      
      const cached = CacheManager.getCachedWeather();
      expect(cached).toEqual(weatherData);
    });

    it('should return null when no weather cache exists', () => {
      const cached = CacheManager.getCachedWeather();
      expect(cached).toBeNull();
    });
  });

  describe('Image Cache', () => {
    it('should cache images with category', () => {
      const images = [
        { url: 'test1.jpg', author: 'Author 1' },
        { url: 'test2.jpg', author: 'Author 2' }
      ];
      CacheManager.setCachedImages(images, 'nature');
      
      const cached = CacheManager.getCachedImages();
      expect(cached).toEqual(images);
    });

    it('should rotate through cached images', () => {
      const images = [
        { url: 'test1.jpg', author: 'Author 1' },
        { url: 'test2.jpg', author: 'Author 2' }
      ];
      CacheManager.setCachedImages(images, 'nature');
      
      const first = CacheManager.getNextImage();
      const second = CacheManager.getNextImage();
      
      expect(first).toEqual(images[1]); // Index starts at 0, so next is 1
      expect(second).toEqual(images[0]); // Wraps around
    });
  });
});
