import { onCLS as getCLS, onINP as getINP, onFCP as getFCP, onLCP as getLCP, onTTFB as getTTFB } from 'web-vitals/attribution';

interface PerformanceMetrics {
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  timestamp: number;
  url: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    cls: null,
    inp: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    timestamp: Date.now(),
    url: window.location.href
  };

  private readonly thresholds = {
    cls: 0.1,    // Good: ≤ 0.1
    inp: 200,    // Good: ≤ 200ms
    fcp: 1800,   // Good: ≤ 1.8s
    lcp: 2500,   // Good: ≤ 2.5s
    ttfb: 800    // Good: ≤ 800ms
  };

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals(): void {
    getCLS((metric) => {
      this.metrics.cls = metric.value;
      this.logMetric('CLS', metric.value, this.thresholds.cls);
    });

    getINP((metric) => {
      this.metrics.inp = metric.value;
      this.logMetric('INP', metric.value, this.thresholds.inp);
    });

    getFCP((metric) => {
      this.metrics.fcp = metric.value;
      this.logMetric('FCP', metric.value, this.thresholds.fcp);
    });

    getLCP((metric) => {
      this.metrics.lcp = metric.value;
      this.logMetric('LCP', metric.value, this.thresholds.lcp);
    });

    getTTFB((metric) => {
      this.metrics.ttfb = metric.value;
      this.logMetric('TTFB', metric.value, this.thresholds.ttfb);
    });
  }

  private logMetric(name: string, value: number, threshold: number): void {
    const status = value <= threshold ? '✅ Good' : value <= threshold * 2 ? '⚠️ Needs Improvement' : '❌ Poor';
    const unit = name === 'CLS' ? '' : 'ms';
    
    console.log(`%c${name}: ${value.toFixed(2)}${unit} ${status}`, 
      `color: ${value <= threshold ? 'green' : value <= threshold * 2 ? 'orange' : 'red'}`);
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public sendMetrics(endpoint?: string): void {
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.metrics),
      }).catch(console.error);
    }
  }

  public generateReport(): string {
    const report = Object.entries(this.metrics)
      .filter(([key]) => key !== 'timestamp' && key !== 'url')
      .map(([key, value]) => {
        if (value === null) return `${key.toUpperCase()}: Not measured`;
        const threshold = this.thresholds[key as keyof typeof this.thresholds];
        const status = value <= threshold ? 'Good' : value <= threshold * 2 ? 'Needs Improvement' : 'Poor';
        const unit = key === 'cls' ? '' : 'ms';
        return `${key.toUpperCase()}: ${value.toFixed(2)}${unit} (${status})`;
      })
      .join('\n');

    return `Performance Report for ${this.metrics.url}\n${'='.repeat(50)}\n${report}`;
  }
}

// Resource timing analysis
export function analyzeResourceTiming(): void {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const resourcesByType = resources.reduce((acc, resource) => {
    const type = getResourceType(resource.name);
    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);
    return acc;
  }, {} as Record<string, PerformanceResourceTiming[]>);

  console.group('🔍 Resource Loading Analysis');
  
  Object.entries(resourcesByType).forEach(([type, items]) => {
    const totalSize = items.reduce((sum, item) => sum + (item.transferSize || 0), 0);
    const avgDuration = items.reduce((sum, item) => sum + item.duration, 0) / items.length;
    
    console.log(`${type}: ${items.length} files, ${formatBytes(totalSize)}, avg load time: ${avgDuration.toFixed(2)}ms`);
    
    // Show slowest resources
    const slowest = items
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3);
    
    slowest.forEach(resource => {
      console.log(`  ⏱️ ${resource.name.split('/').pop()}: ${resource.duration.toFixed(2)}ms`);
    });
  });
  
  console.groupEnd();
}

function getResourceType(url: string): string {
  if (url.includes('.js')) return 'JavaScript';
  if (url.includes('.css')) return 'CSS';
  if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'Images';
  if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'Fonts';
  return 'Other';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Memory usage monitoring
export function analyzeMemoryUsage(): void {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.group('💾 Memory Usage');
    console.log(`Used JS Heap: ${formatBytes(memory.usedJSHeapSize)}`);
    console.log(`Total JS Heap: ${formatBytes(memory.totalJSHeapSize)}`);
    console.log(`JS Heap Limit: ${formatBytes(memory.jsHeapSizeLimit)}`);
    console.log(`Usage: ${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2)}%`);
    console.groupEnd();
  }
}

// Create and export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Development tools
if (process.env.NODE_ENV === 'development') {
  // Add performance monitoring to window for debugging
  (window as any).performanceMonitor = performanceMonitor;
  (window as any).analyzeResourceTiming = analyzeResourceTiming;
  (window as any).analyzeMemoryUsage = analyzeMemoryUsage;
  
  // Log performance report after 5 seconds
  setTimeout(() => {
    console.log(performanceMonitor.generateReport());
    analyzeResourceTiming();
    analyzeMemoryUsage();
  }, 5000);
}
