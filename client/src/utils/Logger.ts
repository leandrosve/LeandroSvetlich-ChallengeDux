
type Serializable = string | number | boolean | object | null;
/* 
  Pequeña clase para mejorar los logs, y permitir deshabilitarlos dependiendo del ambiente
*/
class Logger {
  private static enabled = process.env.NEXT_PUBLIC_ENABLE_LOGGER != "false";

  public static setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private static safeStringify(obj: unknown) {
    try {
      if (typeof obj === "object" && obj !== null) {
        return JSON.stringify(obj, null, 2);
      }
      return String(obj);
    } catch {
      return "No se pudo serializar el objeto";
    }
  }

  private static log(
    color: string,
    background: string,
    objects: Serializable[],
    prefix: string
  ) {
    if (!this.enabled) return;

    const message = objects.map(this.safeStringify).join(" ");

    console.log(
      `%c${prefix}${message}`,
      `background-color: ${background}; color: ${color}; padding: 2px 6px; border-radius: 3px`
    );
  }

  public static info(...objects: Serializable[]) {
    this.log("#296fa8", "#90cdf4", objects, "🏁 ");
  }

  public static warn(...objects: Serializable[]) {
    this.log("#7f611f", "#f4d990", objects, "🚨 ");
  }

  public static danger(...objects: Serializable[]) {
    this.log("#a82929", "#f49090", objects, "💀 ");
  }

  public static success(...objects: Serializable[]) {
    this.log("#1f7f2f", "#9ff490", objects, "✅ ");
  }

  public static debug(...objects: Serializable[]) {
    this.log("#4d4d4d", "#c2c2c2", objects, "🐛 ");
  }
}

export default Logger;
