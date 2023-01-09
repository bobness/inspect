const React = require("react-native");

const { StyleSheet } = React;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  pageContainer: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 50,
    marginBottom: 30,
    textTransform: "uppercase",
    textAlign: "center",
    marginHorizontal: "auto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  actionButtonIcon: {
    fontSize: 26,
    color: "white",
    backgroundColor: "red",
  },
});
export default styles;
