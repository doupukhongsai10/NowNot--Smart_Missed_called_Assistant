import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // dashboard.html exact color tokens
  static const Color bgVoid = Color(0xFF07080F);
  static const Color bgBase = Color(0xFF0B0D1A);
  static const Color bgElevated = Color(0xFF10132A);
  static const Color bgSurface = Color(0xFF161A35);
  static const Color bgOverlay = Color(0xFF1E2240);

  static const Color primaryLavender = Color(0xFFD2BBFF);
  static const Color primaryContainer = Color(0xFF7C3AED);
  static const Color statusActive = Color(0xFF8B5CF6);
  static const Color statusScheduled = Color(0xFFF59E0B);
  static const Color statusExpiring = Color(0xFFEF4444);

  static const Color groupFamily = Color(0xFFF472B6);
  static const Color groupFriends = Color(0xFF38BDF8);
  static const Color groupWork = Color(0xFFFBBF24);
  static const Color groupUnknown = Color(0xFF94A3B8);

  static const Color onSurface = Color(0xFFE3E1EC);
  static const Color onSurfaceVariant = Color(0xFFCCC3D8);
  static const Color glassBorder = Color(0x14FFFFFF); // rgba(255,255,255,0.08)
  static const Color glassBorderActive = Color(0x38D2BBFF);

  // Backward compatibility getters
  static const Color primaryAccent = primaryContainer;
  static const Color secondaryAccent = groupFriends;
  static const Color textPrimary = onSurface;
  static const Color textSecondary = onSurfaceVariant;
  static const Color dangerRose = statusExpiring;

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgBase,
      primaryColor: primaryLavender,
      colorScheme: const ColorScheme.dark(
        primary: primaryLavender,
        secondary: groupFriends,
        surface: bgSurface,
        error: statusExpiring,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.bold, color: onSurface),
        titleLarge: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w600, color: onSurface),
        titleMedium: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: onSurface),
        bodyLarge: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.normal, color: onSurface),
        bodyMedium: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.normal, color: onSurfaceVariant),
      ),
      useMaterial3: true,
    );
  }
}
