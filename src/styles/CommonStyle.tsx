const React = require("react-native");

const { StyleSheet } = React;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    width: '100%',
    alignItems: "center"
  },
  pageContainer: {
    flex: 1,
    width: '100%',
    padding: 10
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  }
});
export default styles;