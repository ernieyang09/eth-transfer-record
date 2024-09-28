const TransferItem = () => {
  return (
    <div>
      <div>Recipient:</div>
      <div>Amount:</div>
      <div>Block number:</div>
      <div>
        Transaction Hash:{" "}
        <span className="text-xs font-normal leading-snug text-muted-foreground">
          0x123
        </span>
      </div>
    </div>
  );
};

const TransferList = () => {
  console.log(2222);

  return (
    <div>
      {[...Array(10)].map((_, i) => (
        <TransferItem key={i} />
      ))}
    </div>
  );
};

export default TransferList;
