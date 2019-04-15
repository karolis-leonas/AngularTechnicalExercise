export class ApplicationConstants {
  public static PasswordValidationRegex = '^(?=.*[A-Z])(?=.*[0-9])(?=.*\\W)([a-zA-Z0-9_\\W]+)$';
  public static EmailValidationRegex = `^[a-zA-Z._]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,}$`;
  public static TimeoutDuration = 1000 * 60 * 5;
}
