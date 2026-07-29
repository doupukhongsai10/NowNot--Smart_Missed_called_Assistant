import 'package:flutter_test/flutter_test.dart';
import 'package:nownot_flutter/main.dart';

void main() {
  testWidgets('NowNotApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NowNotApp());
    expect(find.text('Welcome to NowNot'), findsOneWidget);
  });
}
