export class EntityColorUtility {
  static getInitialsColor(initials: string): string {
    const colors: Record<string, string> = {
      OR: '#6366F1',
      CA: '#22C55E',
      CM: '#F59E0B',
    };
    return colors[initials] ?? '#94A3B8';
  }

  static getIconBg(icon: string): string {
    const map: Record<string, string> = {
      netflix: '#E50914',
      spotify: '#1DB954',
      amazon: '#FF9900',
      carrefour: '#004A97',
      shopify: '#96BF48',
    };
    return map[icon] ?? '#64748B';
  }

  static getIconLabel(icon: string): string {
    return icon.charAt(0).toUpperCase();
  }
}