package com.example.housekeeperapplication.Adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.CheckBox;
import android.widget.ExpandableListView;
import android.widget.TextView;

import com.example.housekeeperapplication.Model.Service;
import com.example.housekeeperapplication.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ServiceExpandableAdapter extends BaseExpandableListAdapter {
    private Context context;
    private List<ServiceTypeGroup> groupList;
    private Map<Integer, Boolean> childCheckStates;
    private ExpandableListViewHeightListener heightListener;

    public interface ExpandableListViewHeightListener {
        void onHeightChanged(int newHeight);
    }

    public ServiceExpandableAdapter(Context context, List<Service> services, ExpandableListViewHeightListener listener) {
        this.context = context;
        this.childCheckStates = new HashMap<>();
        this.groupList = processData(services);
        this.heightListener = listener;
        initializeCheckStates(services);
    }

    private List<ServiceTypeGroup> processData(List<Service> services) {
        Map<String, ServiceTypeGroup> groupMap = new HashMap<>();

        for (Service service : services) {
            String typeName = service.getServiceType().getServiceTypeName();
            if (!groupMap.containsKey(typeName)) {
                groupMap.put(typeName, new ServiceTypeGroup(typeName, new ArrayList<>()));
            }
            groupMap.get(typeName).addService(service);
        }

        return new ArrayList<>(groupMap.values());
    }

    private void initializeCheckStates(List<Service> services) {
        for (Service service : services) {
            childCheckStates.put(service.getServiceID(), false);
        }
    }

    @Override
    public int getGroupCount() {
        return groupList != null ? groupList.size() : 0;
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        if (groupList == null || groupPosition >= groupList.size()) {
            return 0;
        }
        return groupList.get(groupPosition).getServices().size();
    }

    @Override
    public Object getGroup(int groupPosition) {
        return groupList.get(groupPosition);
    }

    @Override
    public Object getChild(int groupPosition, int childPosition) {
        return groupList.get(groupPosition).getServices().get(childPosition);
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return groupList.get(groupPosition).getServices().get(childPosition).getServiceID();
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isExpanded, View convertView, ViewGroup parent) {
        if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.expandable_group_item, parent, false);
        }

        ServiceTypeGroup group = (ServiceTypeGroup) getGroup(groupPosition);
        TextView tvGroup = convertView.findViewById(R.id.tvGroupTitle);
        tvGroup.setText(group.getTypeName());

        // Thêm icon mũi tên để chỉ trạng thái mở rộng/thu gọn
        TextView tvArrow = convertView.findViewById(R.id.tvArrow);
        tvArrow.setText(isExpanded ? "▼" : "▶");

        return convertView;
    }

    @Override
    public View getChildView(int groupPosition, int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.expandable_child_item, parent, false);
        }

        Service service = (Service) getChild(groupPosition, childPosition);
        CheckBox cbService = convertView.findViewById(R.id.cbService);
        TextView tvPrice = convertView.findViewById(R.id.tvPrice);

        cbService.setText(service.getServiceName());
        tvPrice.setText(String.format("%,d VND", (int) service.getPrice()));

        cbService.setChecked(Boolean.TRUE.equals(childCheckStates.get(service.getServiceID())));

        cbService.setOnCheckedChangeListener((buttonView, isChecked) -> {
            childCheckStates.put(service.getServiceID(), isChecked);
            notifyDataSetChanged();
        });

        return convertView;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }

    public List<Integer> getSelectedServiceIds() {
        List<Integer> selectedIds = new ArrayList<>();
        for (Map.Entry<Integer, Boolean> entry : childCheckStates.entrySet()) {
            if (entry.getValue()) {
                selectedIds.add(entry.getKey());
            }
        }
        return selectedIds;
    }

    public void setServiceChecked(int serviceId, boolean isChecked) {
        childCheckStates.put(serviceId, isChecked);
        notifyDataSetChanged();
    }

    // Phương thức mới để tính toán chiều cao tổng
    public int calculateTotalHeight(ExpandableListView listView) {
        int totalHeight = 0;
        int groupCount = getGroupCount();

        for (int i = 0; i < groupCount; i++) {
            View groupView = getGroupView(i, false, null, listView);
            groupView.measure(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
                    View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
            totalHeight += groupView.getMeasuredHeight();

            if (listView.isGroupExpanded(i)) {
                int childrenCount = getChildrenCount(i);
                for (int j = 0; j < childrenCount; j++) {
                    View childView = getChildView(i, j, false, null, listView);
                    childView.measure(View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
                            View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
                    totalHeight += childView.getMeasuredHeight();
                }
            }
        }

        // Thêm padding và divider height
        totalHeight += listView.getDividerHeight() * (groupCount - 1);

        return totalHeight;
    }

    public static class ServiceTypeGroup {
        private final String typeName;
        private final List<Service> services;

        public ServiceTypeGroup(String typeName, List<Service> services) {
            this.typeName = typeName;
            this.services = services;
        }

        public void addService(Service service) {
            this.services.add(service);
        }

        public String getTypeName() {
            return typeName;
        }

        public List<Service> getServices() {
            return services;
        }
    }
}