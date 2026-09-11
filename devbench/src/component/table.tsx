import {
  DyvixTable,
  DyvixTableBody,
  DyvixTableRow,
  DyvixTableHead,
  DyvixTableCell
} from '../../../src';
export function TableTest() {
  return (
    <>
      <DyvixTable
        animation={'aurora'}
        theme={'Volcanic'}
        columns={[
          { key: 'id', label: 'ID', sortable: true },
          { key: 'name', label: 'Name', sortable: true },
          { key: 'type', label: 'Type' },
          { key: 'hp', label: 'HP' },
          { key: 'region', label: 'Region' }
        ]}
        data={[
          { id: 2, name: 'Lion', type: 'Wild', hp: 85, region: 'Afr' },
          { id: 1, name: 'Wolf', type: 'Wild', hp: 60, region: 'Eur' },
          { id: 3, name: 'Deer', type: 'Wild', hp: 45, region: 'Asia' },
          { id: 4, name: 'Hawk', type: 'Bird', hp: 30, region: 'Amr' },
          { id: 5, name: 'Bear', type: 'Wild', hp: 90, region: 'Amr' }
        ]}
      />
      <DyvixTable theme={'Cosmos'} animation={'bounce'}>
        <DyvixTable.Header>
          <DyvixTable.Row>
            <DyvixTableHead>Vehicle</DyvixTableHead>
            <DyvixTableHead>Class</DyvixTableHead>
            <DyvixTableHead>Top Speed</DyvixTableHead>
          </DyvixTable.Row>
        </DyvixTable.Header>
        <DyvixTableBody>
          <DyvixTableRow>
            <DyvixTableCell>Nissan Skyline GT-R R34</DyvixTableCell>
            <DyvixTableCell>Street</DyvixTableCell>
            <DyvixTableCell>180</DyvixTableCell>
          </DyvixTableRow>
          <DyvixTableRow>
            <DyvixTableCell>Porsche 911 GT3 RS</DyvixTableCell>
            <DyvixTableCell>Track</DyvixTableCell>
            <DyvixTableCell>193</DyvixTableCell>
          </DyvixTableRow>
          <DyvixTableRow>
            <DyvixTableCell>Mazda RX-7 FD</DyvixTableCell>
            <DyvixTableCell>Drift</DyvixTableCell>
            <DyvixTableCell>160</DyvixTableCell>
          </DyvixTableRow>
        </DyvixTableBody>
      </DyvixTable>
    </>
  );
}
