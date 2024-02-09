const sleep = async (int) => await new Promise((resolve) => setTimeout(resolve, int));

export default sleep;
